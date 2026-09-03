# Debugging Guide

Comprehensive guide for debugging issues in the File Browser Agent and Skills system.

## 🔍 Quick Debug Checklist

Before diving deep, try these:

- [ ] Restart the app completely
- [ ] Clear node_modules and reinstall: `npm install`
- [ ] Check API key is set and valid
- [ ] Verify skills folder exists: `~/.file-browser-agent/skills/`
- [ ] Look for error messages in console
- [ ] Check that you're on Windows 10 or 11
- [ ] Verify Node.js version: `node --version` (should be 20+)

## 🛠️ Debug Mode

### Enable Debug Logging

```bash
# Windows PowerShell
$env:DEBUG = "skills:*"
npm run dev

# Or set in .env
DEBUG=skills:*
```

This will log:
- All skill discovery operations
- Tool activations
- IPC messages
- Error details

### VS Code Debugging

1. Open VS Code
2. Go to Run → Add Configuration
3. Choose "Electron: Main" or "Electron: Renderer"
4. Set breakpoints in code
5. Press F5 to start debugging

**Breakpoint locations:**
- `src/main/services/skills.ts` - Discovery logic
- `src/main/services/agent-tools.ts` - Tool handling
- `src/main/index.ts` - App initialization

## 📋 Common Issues & Solutions

### Issue: App won't start

**Symptoms:**
- App crashes immediately on `npm run dev`
- Error about missing file or module

**Debug steps:**

```bash
# 1. Check Node version
node --version  # Should be 20.0.0 or higher

# 2. Check npm version
npm --version   # Should be 10.0.0 or higher

# 3. Clear cache
rm -r node_modules package-lock.json dist
npm install
node node_modules/electron/install.js

# 4. Try building
npm run build

# 5. Check for errors
npm run typecheck
```

**Error message clues:**
- "Cannot find module" → Run `npm install`
- "electron not found" → Run `node node_modules/electron/install.js`
- "Not a valid Win32 application" → Reinstall node_modules

---

### Issue: Skills not appearing in app

**Symptoms:**
- Agent says "No skills installed"
- Created skill doesn't show up
- Skill shows up but without description

**Debug steps:**

```bash
# 1. Verify folder structure
ls ~/.file-browser-agent/skills/
ls ~/.file-browser-agent/skills/my-skill/
ls ~/.file-browser-agent/skills/my-skill/SKILL.md

# 2. Check SKILL.md is valid
cat ~/.file-browser-agent/skills/my-skill/SKILL.md

# Should start with:
# ---
# name: "my-skill"
# description: "..."
# ---

# 3. Check file encoding (should be UTF-8)
# In VS Code: View → Command Palette → Change End of Line

# 4. Verify name format
# Must be lowercase, hyphens only (no spaces)
# Examples: ✅ my-skill, ✅ code-analyzer
#           ❌ MySkill, ❌ my skill

# 5. Restart app
npm run dev

# 6. Check console for errors
# Look for: "Error loading skill" or "Skipping"
```

**Common mistakes:**
- File named `skill.md` instead of `SKILL.md` (case sensitive)
- Missing `---` delimiter in frontmatter
- Invalid YAML syntax (quotes, colons)
- Skill name with spaces or capital letters
- Nested too deep: `skills/category/skill/` (use flat structure)

---

### Issue: API errors in chat

**Symptoms:**
- Error message: "Failed to get response"
- Empty response from Claude
- "API rate limit exceeded"

**Debug steps:**

```bash
# 1. Verify API key
echo $ANTHROPIC_API_KEY

# Should output: sk-ant-...
# If empty, API key not set

# 2. Check .env file
cat .env

# Should contain: ANTHROPIC_API_KEY=sk-ant-...
# Make sure no extra spaces or quotes

# 3. Test API connection
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.anthropic.com/v1/models

# 4. Check for typos
# Copy API key fresh from console.anthropic.com

# 5. Verify key is active
# Visit https://console.anthropic.com/account/keys
# Delete old keys if too many exist
```

**Error message details:**
- "401 Unauthorized" → API key invalid or wrong
- "429 Too Many Requests" → Rate limited, wait a minute
- "500 Internal Server Error" → Anthropic server issue
- "Network error" → Check internet connection

---

### Issue: TypeScript errors during development

**Symptoms:**
- `npm run typecheck` shows errors
- Red squiggles in VS Code
- Build fails with "Type error"

**Debug steps:**

```bash
# 1. See all errors
npm run typecheck

# 2. Read error carefully
# Look for line number and suggestion
# Example: "Cannot assign type 'string' to type 'LoadedSkill'"

# 3. Fix the issue
# - Check variable types
# - Look for missing properties
# - Verify function signatures
# - Check null/undefined handling

# 4. Verify fix
npm run typecheck

# 5. If stuck, reset code
git checkout src/
npm run typecheck
```

**Common TypeScript errors:**
- "Cannot find name 'X'" → Import missing
- "Type 'X' is not assignable to 'Y'" → Wrong type
- "Property 'X' does not exist" → Typo in property name
- "Argument of type 'X' is not assignable to 'Y'" → Wrong parameter type

**Quick fixes:**
```typescript
// ❌ Error: Cannot find name 'LoadedSkill'
const skill: LoadedSkill = ...

// ✅ Fix: Import the type
import { LoadedSkill } from './services/skills'
const skill: LoadedSkill = ...
```

---

### Issue: Skill runs but no output

**Symptoms:**
- Skill activates successfully
- Commands shown but nothing happens
- No error message

**Debug steps:**

1. **Check skill body is complete**
   ```bash
   # Verify SKILL.md has instructions
   wc -l ~/.file-browser-agent/skills/my-skill/SKILL.md
   # Should be >10 lines
   ```

2. **Check commands are documented**
   ```bash
   # SKILL.md should explain:
   # - What the skill does
   # - Available commands
   # - How to use it
   # - Example commands
   ```

3. **Test command directly**
   ```bash
   # If skill has a script, test it:
   bash ~/.file-browser-agent/skills/my-skill/script.sh
   ```

4. **Check file permissions**
   ```bash
   # Scripts need execute permission
   chmod +x ~/.file-browser-agent/skills/my-skill/script.sh
   ```

---

## 🧪 Testing & Validation

### Test Skills Discovery

```typescript
// In app console (F12)
const skills = await window.api.invoke('skill:list');
console.log(skills);
// Should show all installed skills
```

### Test Tool Activation

```typescript
// Manually activate a skill
const result = await window.api.invoke('skill:activate', {
  name: 'code-analyzer'
});
console.log(result);
// Should show skill details including body
```

### Test File System

```bash
# List all files in skills directory
ls -R ~/.file-browser-agent/skills/

# Check file sizes
du -sh ~/.file-browser-agent/skills/*

# Look for large files
find ~/.file-browser-agent/skills -size +1M
```

## 📊 Performance Debugging

### Slow Skill Discovery

**If skills loading takes >200ms:**

```bash
# 1. Count skills
ls ~/.file-browser-agent/skills/ | wc -l

# 2. Check file sizes
du -h ~/.file-browser-agent/skills/**/SKILL.md

# 3. Look for problems
# - Too many skills (>100)
# - Very large SKILL.md files (>50KB)
# - Nested directories (should be flat)

# Solution: Move unused skills to archive folder
mkdir ~/.file-browser-agent/skills-archive
mv ~/.file-browser-agent/skills/unused ~/.file-browser-agent/skills-archive/
```

### Slow Tool Activation

**If tool activation takes >5 seconds:**

```bash
# 1. Check network
# Open DevTools, Network tab
# Look for API requests
# Should be 1-2 requests to anthropic.com

# 2. Check selected file size
# Large files slow down Claude
# Try with smaller file

# 3. Check disk I/O
# Skills with large bodies slow discovery
# See "Slow Skill Discovery" section above
```

## 🔐 Security Debugging

### Check for API Key Leaks

```bash
# Search for hardcoded keys
grep -r "sk-ant-" .
# Should only find .env file

# Check git history
git log --all -S "sk-ant-"
# Should be empty (never committed)

# Check for exports
grep -r "ANTHROPIC_API_KEY" src/
# Should only be in config/init files
```

### Verify No Sensitive Data Logged

```bash
# Check for console.log statements
grep -r "console.log.*password\|key\|secret" src/

# Check for error dumps
grep -r "error\.message" src/
# Make sure errors don't leak sensitive info
```

## 📝 Logging Best Practices

### What to Log

```typescript
// ✅ Good logging
console.log('Skill "code-analyzer" activated');
console.log(`Discovered ${skills.length} skills`);
console.log('Skill body retrieved successfully');

// ❌ Bad logging
console.log(skillObject);  // Too much data
console.log(apiKey);       // Security issue
console.log(userData);     // Privacy issue
```

### Structured Logging

```typescript
// Better approach for debugging
if (process.env.DEBUG?.includes('skills')) {
  console.debug('[SKILLS] Discovered', {
    count: skills.length,
    names: skills.map(s => s.name)
  });
}
```

## 🔧 Command Line Debugging

### Print Detailed Info

```bash
# Show all environment variables
env | grep -i anthropic

# Show Node version with detail
node --version && npm --version

# Show git status
git status
git log --oneline -5

# Show disk usage
df -h .
du -sh .

# Show process info
ps aux | grep node
ps aux | grep electron
```

## 📞 Getting Help

### When to Report a Bug

Report if:
- Bug is reproducible with steps
- Error message is clear
- Affects multiple skill scenarios
- Present in latest version

**Don't report:**
- Usage questions (ask in Discussions)
- System-specific issues (check your setup)
- API limit issues (that's usage, not bug)

### How to Report

1. **Check existing issues** - Maybe someone reported it
2. **Gather info**:
   - OS version (Windows 10 vs 11)
   - Node version (`node --version`)
   - Error message (exact text)
   - Steps to reproduce
   - Screenshots if visual

3. **Create issue** on GitHub with:
   - Clear title
   - Description
   - Steps to reproduce
   - Expected vs actual behavior
   - System info
   - Screenshots/error logs

### Debug Info to Share

```bash
# Generate system info for bug report
echo "=== System Info ===" && \
node --version && \
npm --version && \
echo "=== Git Info ===" && \
git log --oneline -1 && \
echo "=== Environment ===" && \
echo "ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY:0:20}..." && \
echo "=== Skills ===" && \
ls ~/.file-browser-agent/skills/ 2>/dev/null || echo "No skills found"
```

## 🎓 Advanced Debugging

### Enable Internal Logs

Edit `src/main/services/skills.ts`:

```typescript
// Add to loadSkills function
console.debug(`[SKILLS] Scanning: ${skillsRoot}`);
console.debug(`[SKILLS] Found directories:`, dirs);
// ... rest of function
console.debug(`[SKILLS] Loaded ${skills.length} skills`);
```

### Attach DevTools

```bash
# Main process debugging
npm run dev

# Then in DevTools:
# F12 → Open DevTools
# Ctrl+Shift+J → DevTools in new window
# Network tab → See API calls
# Console tab → See logs
```

### Memory Profiling

```typescript
// In React component
useEffect(() => {
  const before = process.memoryUsage();
  SKILLS_STORE.reload();
  const after = process.memoryUsage();
  
  console.log('Memory delta:', {
    heapUsed: after.heapUsed - before.heapUsed
  });
}, []);
```

## 📚 Additional Resources

- [Electron Debugging](https://www.electronjs.org/docs/tutorial/debugging)
- [Node.js Debugging](https://nodejs.org/en/docs/guides/debugging-getting-started/)
- [VS Code Debugging](https://code.visualstudio.com/docs/editor/debugging)
- [TypeScript Errors](https://www.typescriptlang.org/docs/handbook/error-index.html)

---

**Happy debugging!** 🐛

For more help, see [FAQ.md](FAQ.md) or open a [GitHub Discussion](https://github.com/dassi-git/file-browser-agent-skills/discussions).
