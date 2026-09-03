# API Documentation

Complete API reference for the Skills system.

## 🔷 Core Types

### LoadedSkill

Represents a fully loaded skill with all metadata and instructions.

```typescript
interface LoadedSkill {
  name: string;           // Unique skill identifier (kebab-case)
  description: string;    // One-line description for catalog
  location: string;       // Full path to SKILL.md file
  body: string;          // Full instructions/body content
}
```

**Example:**
```typescript
{
  name: "code-analyzer",
  description: "Analyzes code for quality and complexity",
  location: "/home/user/.file-browser-agent/skills/code-analyzer/SKILL.md",
  body: "# Code Analyzer\n\n## Overview\n..."
}
```

### InstalledSkill

Lightweight version of LoadedSkill without the body content. Used for listing.

```typescript
interface InstalledSkill {
  name: string;
  description: string;
  location: string;
}
```

### SkillMetadata

Metadata from SKILL.md frontmatter (YAML).

```typescript
interface SkillMetadata {
  name: string;
  description: string;
  tags?: string[];
  author?: string;
  version?: string;
  license?: string;
}
```

## 🎯 SkillsStore Class

Singleton class managing all skill operations.

### Methods

#### `reload(): Promise<void>`

Loads all skills from disk into memory.

```typescript
// Call on app startup
await SKILLS_STORE.reload();
```

**Behavior:**
- Scans `~/.file-browser-agent/skills/*/SKILL.md`
- Parses YAML frontmatter
- Extracts body content
- Caches result in memory

**Errors:**
- Gracefully handles missing directory (returns empty)
- Skips malformed SKILL.md files
- Logs warnings for invalid files

**Performance:**
- ~20ms for 10 skills
- ~80ms for 50 skills
- ~150ms for 100 skills

---

#### `getByName(name: string): LoadedSkill | undefined`

Retrieves a single skill by name.

```typescript
const skill = SKILLS_STORE.getByName('code-analyzer');
if (!skill) {
  console.error('Skill not found');
}
```

**Parameters:**
- `name` (string): Skill name in kebab-case

**Returns:**
- `LoadedSkill` if found
- `undefined` if not found

**Performance:** O(n), typically <1ms

---

#### `listAvailable(): InstalledSkill[]`

Returns all available skills without body content.

```typescript
const skills = SKILLS_STORE.listAvailable();
for (const skill of skills) {
  console.log(`${skill.name}: ${skill.description}`);
}
```

**Returns:**
- Array of `InstalledSkill` objects
- Empty array if no skills found
- Sorted by name

**Performance:** O(n), typically <5ms

---

#### `getBulletList(): string`

Generates formatted catalog for tool description.

```typescript
const catalog = SKILLS_STORE.getBulletList();
console.log(catalog);
// Output:
// - code-analyzer: Analyzes code for quality issues
// - data-transformer: Transforms data between formats
// (No skills installed)  // if empty
```

**Returns:**
- Formatted string with bullet points
- One skill per line: `- name: description`
- "(No skills installed)" if empty

**Performance:** O(n), typically <10ms

**Used by:** `activate_skill` tool description

## 🛠️ Tool Definitions

### activate_skill Tool

Allows Claude to activate and use a skill.

```typescript
const tool = {
  name: "activate_skill",
  description: `Activate a specialized skill for extended capabilities...
Available skills:
${SKILLS_STORE.getBulletList()}

When activated, you receive the skill's full instructions including available commands...`,
  input_schema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the skill to activate (e.g., 'code-analyzer')"
      }
    },
    required: ["name"]
  }
}
```

**Input Schema:**
```json
{
  "name": "code-analyzer"
}
```

**Output:**

```json
{
  "success": true,
  "message": "Skill 'code-analyzer' activated",
  "skill": {
    "name": "code-analyzer",
    "description": "Analyzes code for quality and complexity",
    "location": "/home/user/.file-browser-agent/skills/code-analyzer",
    "body": "# Code Analyzer\n\n## Overview\n..."
  },
  "workDir": "/current/working/directory"
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "Skill 'unknown-skill' not found",
  "available": "- code-analyzer: Analyzes code\n- data-transformer: Transforms data"
}
```

## 📁 File System Structure

### Skills Directory

```
~/.file-browser-agent/
└── skills/
    ├── skill-1/
    │   ├── SKILL.md              # Required: skill definition
    │   ├── script.sh             # Optional: executable script
    │   ├── utils.ts              # Optional: utility code
    │   └── README.md             # Optional: detailed guide
    ├── skill-2/
    │   └── SKILL.md
    └── skill-3/
        └── SKILL.md
```

### SKILL.md Format

```markdown
---
name: "skill-name"
description: "One-line description"
tags: ["tag1", "tag2"]
author: "Your Name"
version: "1.0.0"
---

# Skill Title

## Overview
Detailed explanation of what this skill does.

## Available Commands
Commands the skill can execute.

## Usage Example
How to use this skill.
```

## 🔗 IPC Channels

### UI → Main Process

#### `skill:list`

List all installed skills.

```typescript
const skills = await ipcRenderer.invoke('skill:list');
// Returns: InstalledSkill[]
```

**Response:**
```typescript
[
  {
    name: "code-analyzer",
    description: "Analyzes code for quality",
    location: "/path/to/skill"
  },
  // ...
]
```

---

#### `skill:install`

Install a new skill (future feature).

```typescript
const result = await ipcRenderer.invoke('skill:install', {
  zipPath: '/path/to/skill.zip'
});
```

---

#### `skill:reload`

Refresh skill catalog after installation.

```typescript
const result = await ipcRenderer.invoke('skill:reload');
// Returns: { success: boolean, count: number }
```

## 📊 Error Handling

### Error Codes

```typescript
enum SkillError {
  NOT_FOUND = "SKILL_NOT_FOUND",
  INVALID_FORMAT = "SKILL_INVALID_FORMAT",
  MISSING_METADATA = "SKILL_MISSING_METADATA",
  LOAD_FAILED = "SKILL_LOAD_FAILED",
  DIRECTORY_MISSING = "SKILLS_DIR_MISSING"
}
```

### Error Messages

**When skill not found:**
```
Skill 'unknown-skill' not found.
Available skills: code-analyzer, data-transformer
```

**When SKILL.md is malformed:**
```
Error loading skill 'my-skill': 
Invalid YAML frontmatter. Check that SKILL.md starts with:
---
name: "..."
description: "..."
---
```

**When skills directory missing:**
```
Skills directory not found: ~/.file-browser-agent/skills
Creating directory...
No skills available yet. Create skill folders to get started.
```

## 🚀 Usage Examples

### Example 1: Activate a Skill

```typescript
// Claude's tool call
{
  name: "activate_skill",
  input: {
    name: "code-analyzer"
  }
}

// Response includes:
// - Full skill instructions
// - Available commands
// - Working directory context
// - File location for scripts
```

### Example 2: List Skills Programmatically

```typescript
import { SKILLS_STORE } from './services/skills';

// After reload
const all = SKILLS_STORE.listAvailable();
const codes = all.find(s => s.name === 'code-analyzer');

if (codes) {
  console.log(`Found: ${codes.description}`);
}
```

### Example 3: Generate Catalog

```typescript
const catalog = SKILLS_STORE.getBulletList();
console.log('Available skills:');
console.log(catalog);
```

## 🔄 Lifecycle

### App Startup

1. `src/main/index.ts` calls `await SKILLS_STORE.reload()`
2. Skills loaded from `~/.file-browser-agent/skills/`
3. Cached in memory for fast access
4. `activate_skill` tool ready for Claude

### Runtime

1. Claude calls `activate_skill` tool
2. Tool calls `SKILLS_STORE.getByName()`
3. Returns full skill including body
4. Claude receives instructions
5. Can use skill to accomplish task

### After Skill Installation

1. UI calls `skill:reload` via IPC
2. Main process calls `SKILLS_STORE.reload()`
3. New skill parsed and cached
4. Available in next chat message

## 🧪 Testing the API

### Manual Testing

```bash
# Start app
npm run dev

# In app chat:
# "List available skills"
# → Claude calls activate_skill to show catalog

# "Activate code-analyzer"
# → Claude gets full instructions
```

### Programmatic Testing

```typescript
import { SKILLS_STORE } from './services/skills';

async function testSkills() {
  // Load skills
  await SKILLS_STORE.reload();
  
  // List all
  const all = SKILLS_STORE.listAvailable();
  console.log(`Found ${all.length} skills`);
  
  // Get one
  const skill = SKILLS_STORE.getByName('example-skill');
  console.log(`Got skill: ${skill?.name}`);
  
  // Get catalog
  const catalog = SKILLS_STORE.getBulletList();
  console.log(catalog);
}

testSkills();
```

## 📈 Performance Characteristics

| Operation | Time | Complexity |
|-----------|------|-----------|
| reload() | 20-150ms | O(n) |
| getByName() | <1ms | O(n) |
| listAvailable() | <5ms | O(n) |
| getBulletList() | <10ms | O(n) |

**n** = number of skills

---

**For more information, see [ARCHITECTURE.md](ARCHITECTURE.md)**
