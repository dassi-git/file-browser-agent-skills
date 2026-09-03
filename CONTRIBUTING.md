# Contributing to File Browser Agent with Skills

Thank you for your interest in contributing! This guide will help you understand the codebase and make meaningful contributions.

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+
- Windows OS (for Electron development)
- Git

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/dassi-git/file-browser-agent-skills.git
cd file-browser-agent-skills

# Install dependencies
npm install
node node_modules/electron/install.js

# Create skills directory
mkdir "$env:USERPROFILE\.file-browser-agent\skills"

# Set API key
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env
```

### Running the Application

```bash
# Development mode with hot reload
npm run dev

# Type checking
npm run typecheck

# Production build
npm run build
npm start
```

## Project Architecture

### File Structure

```
src/main/
├── index.ts                      # App entry point, skills initialization
├── services/
│   ├── skills.ts                 # Skills discovery & store
│   ├── agent-tools.ts            # Tool definitions including activate_skill
│   ├── anthropic-chat.ts         # Chat runner with streaming
│   └── ...
└── ipc/
    ├── skill-handlers.ts         # IPC handlers for skill operations
    └── ...
```

### Three-Phase Architecture

**Phase 1: Discovery** (`services/skills.ts`)
- Scans `~/.file-browser-agent/skills/` directory
- Parses SKILL.md frontmatter
- Caches loaded skills in SkillsStore

**Phase 2: Exposure** (`services/agent-tools.ts`)
- Defines `activate_skill` tool
- Includes dynamic catalog in tool description
- Returns full skill body on activation

**Phase 3: Integration** (`index.ts`, `ipc/skill-handlers.ts`)
- Loads skills on app startup
- Provides IPC handlers for UI
- Refreshes catalog after skill installation

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow existing patterns in the codebase
- Add comments for complex logic
- Keep functions focused and small

### Adding Features

1. **New Tool**: Add to `makeTools()` in `agent-tools.ts`
2. **New IPC Handler**: Add to `registerSkillHandlers()` in `skill-handlers.ts`
3. **New Service**: Create in `services/` with clear exports

### Skill Development

#### Create a New Skill

```bash
mkdir ~/.file-browser-agent/skills/my-skill
```

#### Create `SKILL.md`

```markdown
---
name: "my-skill"
description: "Brief description of what this skill does"
---

# My Skill

## Overview
Detailed explanation...

## Available Commands
- Command 1: description
- Command 2: description

## Examples
Show how to use...
```

#### Skill Best Practices

- ✅ Use absolute paths in commands
- ✅ Write output to working directory (not skill folder)
- ✅ Include error handling examples
- ✅ Document all available commands
- ✅ Test thoroughly before releasing
- ❌ Don't write to skill folder
- ❌ Don't assume file locations
- ❌ Don't require user interaction in scripts

## Testing

### Manual Testing

1. **Test Skill Discovery**
   ```bash
   npm run dev
   # Add a skill and verify it appears in the UI
   ```

2. **Test Activation**
   - Select a file
   - Ask agent to use the skill
   - Verify full instructions are provided

3. **Test Integration**
   - Restart app
   - Verify skills are loaded
   - Check IPC handlers work

### Automated Testing (Coming Soon)

```bash
npm test
```

## Performance Considerations

### Skill Loading
- Discovery is O(n) where n = number of skill folders
- Typical: <100ms for 50 skills
- Runs once on app startup

### Skill Lookup
- Lookup is O(n) - could optimize with Map
- Typical: <1ms even with 100 skills
- Runs per activate_skill call

### Optimization Tips
- Minimize skill body size (use external files for large content)
- Cache expensive operations in SkillsStore
- Use lazy loading for optional skill data

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/skill-marketplace

# Make changes
git add .
git commit -m "feat: add skill marketplace support"

# Push to GitHub
git push origin feature/skill-marketplace

# Create Pull Request on GitHub
```

### Commit Message Format

```
type(scope): description

feat(skills): add versioning support
fix(tool): handle null skill names
docs(readme): update installation guide
test(discovery): add skill loading tests
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `perf`

## Reporting Issues

### Bug Report Template

```markdown
**Describe the bug**
Clear description of what happened

**Steps to Reproduce**
1. Step 1
2. Step 2

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: Windows
- Node: 20.x
- npm: 10.x
```

### Feature Request Template

```markdown
**Describe the feature**
Clear description of the requested feature

**Motivation**
Why is this useful?

**Example Use Case**
How would users benefit?
```

## Code Review Checklist

Before submitting a PR, ensure:

- [ ] Code follows project style guide
- [ ] All TypeScript errors resolved
- [ ] No new warnings in build
- [ ] Changes tested manually
- [ ] Documentation updated
- [ ] Commit messages are clear
- [ ] No breaking changes (or documented)

## Documentation Standards

### Code Comments
```typescript
// Bad
const x = skills.find(s => s.name === name); // find skill

// Good
// Search for skill by name in in-memory store
const skill = SKILLS_STORE.getByName(name);
```

### Function Documentation
```typescript
/**
 * Loads all skills from the filesystem.
 * 
 * Scans the SKILLS_ROOT directory for subdirectories containing
 * SKILL.md files. Each file's YAML frontmatter and body are parsed
 * and returned as LoadedSkill objects.
 * 
 * @returns Array of loaded skills, empty array if no skills found
 * @throws Error if SKILL.md is malformed
 * 
 * @example
 * const skills = await loadSkills();
 * console.log(skills[0].name); // "example-skill"
 */
async function loadSkills(): Promise<LoadedSkill[]> {
  // Implementation...
}
```

## Release Process

1. **Update Version**
   ```bash
   npm version patch  # or minor, major
   ```

2. **Update CHANGELOG**
   - Document all changes
   - Note breaking changes

3. **Create Release**
   ```bash
   git push --tags
   ```

4. **GitHub Release**
   - Create from tag
   - Add release notes
   - Attach build artifacts

## Future Enhancements

Potential areas for contribution:

- [ ] Skill versioning system
- [ ] Skill dependency resolution
- [ ] Skill marketplace / registry
- [ ] Skill validation framework
- [ ] Usage analytics
- [ ] Skill-to-skill communication
- [ ] Visual skill builder
- [ ] Automated testing framework
- [ ] Performance profiling tools
- [ ] Internationalization (i18n)

## Getting Help

- 📖 See [README_IMPLEMENTATION.md](README_IMPLEMENTATION.md) for detailed guide
- 🏗️ See [ARCHITECTURE.md](../../../ARCHITECTURE.md) for system design
- 💬 Open a GitHub Issue for questions
- 🐛 Report bugs with detailed reproduction steps

## Code of Conduct

We're committed to providing a welcoming environment:

- Be respectful and inclusive
- Give constructive feedback
- Help others learn
- Report issues privately if needed

## License

This project is licensed under MIT. By contributing, you agree to license your contributions under the same license.

---

**Thank you for contributing!** 🙏

Your improvements make this project better for everyone.
