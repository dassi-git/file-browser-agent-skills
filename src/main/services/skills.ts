
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { unzipSync } from 'fflate';

export const SKILLS_ROOT =
  process.env.FILE_BROWSER_SKILLS_DIR?.trim() ||
  path.join(os.homedir(), '.file-browser-agent', 'skills');



type SkillFrontmatter = {
  name?: string;
  description?: string;
};

function parseFrontmatter(markdown: string): SkillFrontmatter {
  const frontmatterMatch = markdown.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);

  if (!frontmatterMatch) {
    return {};
  }

  const frontmatter = frontmatterMatch[1];
  const result: SkillFrontmatter = {};

  for (const line of frontmatter.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf(':');

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, '');

    if (key === 'name') {
      result.name = value;
    }

    if (key === 'description') {
      result.description = value;
    }
  }

  return result;
}

function isValidSkillName(name: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(name);
}

export type InstalledSkill = { name: string; description: string; path: string };

/**
 * Installs a skill from a .zip archive into SKILLS_ROOT.
 *
 * A skill is a folder containing a SKILL.md. The zip may either wrap the files
 * in a top-level folder (`my-skill/SKILL.md`, `my-skill/script.py`, …) or place
 * SKILL.md at its root — both are accepted. The folder name is taken from the
 * SKILL.md frontmatter `name`, falling back to the wrapping folder's name.
 *
 * Throws on: missing/invalid SKILL.md, an invalid skill name, a name that is
 * already installed, or any entry that would escape the target folder (zip-slip).
 */
export async function installSkillFromZip(zipPath: string): Promise<InstalledSkill> {
  const buf = await fs.readFile(zipPath);

  let files: Record<string, Uint8Array>;
  try {
    files = unzipSync(new Uint8Array(buf));
  } catch (e) {
    throw new Error(`Not a valid .zip file: ${e instanceof Error ? e.message : String(e)}`);
  }

  // Normalise separators and locate the shallowest SKILL.md — that file's
  // directory is the root of the skill inside the archive.
  const norm = (p: string): string => p.replace(/\\/g, '/');
  let skillMdKey: string | null = null;
  for (const key of Object.keys(files)) {
    const n = norm(key);
    if (key.endsWith('/')) continue; // directory entry
    if (n === 'SKILL.md' || n.endsWith('/SKILL.md')) {
      if (skillMdKey === null || n.split('/').length < norm(skillMdKey).split('/').length) {
        skillMdKey = key;
      }
    }
  }

  if (!skillMdKey) {
    throw new Error('The zip does not contain a SKILL.md file.');
  }

  const skillMd = norm(skillMdKey);
  const prefix = skillMd.slice(0, skillMd.length - 'SKILL.md'.length); // '' or 'folder/'

  const markdown = new TextDecoder('utf-8').decode(files[skillMdKey]);
  const fallbackName = prefix.replace(/\/$/, '').split('/').pop() || '';
  const name = (parseFrontmatter(markdown).name?.trim() || fallbackName).trim();

  if (!isValidSkillName(name)) {
    throw new Error(
      `Invalid skill name "${name}". Names may only contain letters, numbers, hyphens and underscores.`
    );
  }

  const targetDir = path.join(SKILLS_ROOT, name);
  try {
    await fs.access(targetDir);
    throw new Error(`A skill named "${name}" is already installed. Remove it first to reinstall.`);
  } catch (e) {
    // ENOENT means the folder is free — anything else is a real error.
    if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e;
  }

  await fs.mkdir(SKILLS_ROOT, { recursive: true });

  for (const [key, data] of Object.entries(files)) {
    if (key.endsWith('/')) continue; // directory entry
    const n = norm(key);
    if (prefix && !n.startsWith(prefix)) continue; // file outside the skill folder
    const rel = prefix ? n.slice(prefix.length) : n;
    if (!rel) continue;

    const dest = path.join(targetDir, rel);
    // Zip-slip guard: every written path must stay inside targetDir.
    const rootWithSep = targetDir.endsWith(path.sep) ? targetDir : targetDir + path.sep;
    if (dest !== targetDir && !dest.startsWith(rootWithSep)) {
      throw new Error(`Refusing to extract entry outside the skill folder: ${key}`);
    }

    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, data);
  }

  const description = parseFrontmatter(markdown).description?.trim() || '';
  return { name, description, path: targetDir };
}

export type LoadedSkill = {
  name: string;
  description: string;
  location: string;
  body: string;
};

/**
 * Loads all available skills from the SKILLS_ROOT directory.
 * Discovers SKILL.md files in subdirectories and parses their frontmatter + body.
 */
async function loadSkills(): Promise<LoadedSkill[]> {
  const skills: LoadedSkill[] = [];

  try {
    // Ensure the skills directory exists
    await fs.mkdir(SKILLS_ROOT, { recursive: true });

    // List all directories in SKILLS_ROOT
    const entries = await fs.readdir(SKILLS_ROOT, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const skillPath = path.join(SKILLS_ROOT, entry.name);
      const skillMdPath = path.join(skillPath, 'SKILL.md');

      try {
        // Check if SKILL.md exists in this folder
        const markdown = await fs.readFile(skillMdPath, 'utf-8');
        const frontmatter = parseFrontmatter(markdown);

        const name = frontmatter.name?.trim() || entry.name;
        const description = frontmatter.description?.trim() || '';

        // Extract body (everything after frontmatter)
        const bodyMatch = markdown.match(/^---\s*\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)/);
        const body = bodyMatch ? bodyMatch[1].trim() : markdown;

        if (isValidSkillName(name)) {
          skills.push({
            name,
            description,
            location: skillPath,
            body
          });
        }
      } catch {
        // Skip directories without valid SKILL.md files
        continue;
      }
    }
  } catch {
    // If SKILLS_ROOT doesn't exist, return empty array
    return [];
  }

  return skills;
}

/**
 * Singleton store for managing available skills.
 * Loads skills once and provides methods to query them.
 */
class SkillsStoreClass {
  private skills: LoadedSkill[] = [];
  private loaded = false;

  async reload(): Promise<void> {
    this.skills = await loadSkills();
    this.loaded = true;
  }

  getByName(name: string): LoadedSkill | undefined {
    return this.skills.find((s) => s.name === name);
  }

  listAvailable(): InstalledSkill[] {
    return this.skills.map((s) => ({
      name: s.name,
      description: s.description,
      path: s.location
    }));
  }

  getBulletList(): string {
    if (this.skills.length === 0) {
      return '(No skills installed)';
    }
    return this.skills
      .map((s) => `- **${s.name}**: ${s.description}`)
      .join('\n');
  }
}

export const SKILLS_STORE = new SkillsStoreClass();
