# FAQ - Frequently Asked Questions

## 🚀 Getting Started

### Q: How do I install the File Browser Agent?

**A:** Follow these steps:

```bash
# 1. Clone the repository
git clone https://github.com/dassi-git/file-browser-agent-skills.git
cd file-browser-agent-skills

# 2. Install dependencies
npm install
node node_modules/electron/install.js

# 3. Create skills directory
mkdir -p ~/.file-browser-agent/skills

# 4. Set your API key
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env

# 5. Run the app
npm run dev
```

**See:** [QUICK_START.md](QUICK_START.md)

---

### Q: What are the system requirements?

**A:** You need:

- **OS**: Windows 10 or Windows 11
- **Node.js**: 20.0.0 or higher
- **npm**: 10.0.0 or higher
- **RAM**: 4GB minimum (8GB recommended)
- **Disk**: 500MB free space
- **API Key**: Anthropic API key (free trial available)

---

### Q: Do I need to pay for this?

**A:** The code is free (MIT License). However:

- **Anthropic API**: You pay for Claude API usage (pay-as-you-go)
- **Free tier**: $5 free credits available
- **Pricing**: ~$0.003 per 1K input tokens

Check [Anthropic Pricing](https://www.anthropic.com/pricing) for current rates.

---

## ⚙️ Setup & Configuration

### Q: Where should I put my API key?

**A:** Three options (in order of preference):

```bash
# Option 1: .env file (recommended for security)
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env

# Option 2: Enter in app UI
# Open app, click settings, paste key

# Option 3: Environment variable
export ANTHROPIC_API_KEY=sk-ant-...
npm run dev
```

**⚠️ Important**: Never commit your API key to git!

---

### Q: How do I update my API key?

**A:**

1. Open the app settings (⚙️ icon)
2. Clear current key
3. Paste new key
4. Click "Save"

Or update the `.env` file and restart the app.

---

### Q: Can I use this without an API key?

**A:** No. The app requires an Anthropic API key to function. However:

- Free trial includes $5 of credits
- Perfect for testing and learning
- No credit card required for trial

[Get free credits →](https://console.anthropic.com)

---

## 🎯 Skills

### Q: What is a skill?

**A:** A skill is a specialized instruction set that extends what Claude can do. Skills are:

- **Located** in `~/.file-browser-agent/skills/`
- **Defined** in a `SKILL.md` file
- **Discovered** automatically on app startup
- **Activated** by Claude when needed

**Example:** A code-analyzer skill might teach Claude how to analyze TypeScript files.

---

### Q: How do I create a skill?

**A:** Create this structure:

```
~/.file-browser-agent/skills/my-skill/
├── SKILL.md              # Required
└── scripts/
    └── analyze.sh        # Optional
```

**SKILL.md:**
```markdown
---
name: "my-skill"
description: "What this skill does"
---

# My Skill

## Overview
Detailed explanation...

## Commands
Available commands:
- command 1
- command 2
```

**See:** [CONTRIBUTING.md](CONTRIBUTING.md) for full guide

---

### Q: Where do I put my skills?

**A:** In this directory (create if missing):

```
Windows: C:\Users\{YourUsername}\.file-browser-agent\skills\
```

**Example:**
```
C:\Users\john\.file-browser-agent\skills\code-analyzer\SKILL.md
C:\Users\john\.file-browser-agent\skills\data-transformer\SKILL.md
```

---

### Q: How do I share a skill?

**A:**

1. Create a GitHub repository
2. Add your skill files
3. Add a comprehensive README.md
4. Share the link with others
5. They can copy it to their skills folder

**Example:** [example-skill](examples/example-skill/)

---

### Q: Can I install skills from others?

**A:** Yes! Manual process for now:

1. Find a skill on GitHub
2. Copy the skill folder to `~/.file-browser-agent/skills/`
3. Restart the app
4. Ask Claude to use the skill

**Future:** Skill marketplace coming in v1.1+

---

### Q: How many skills can I have?

**A:** Technically unlimited, but:

- **Recommended**: < 50 skills for best performance
- **Good performance**: Up to 100 skills
- **Consider optimization**: 200+ skills

The system is designed to scale to 100+ skills with minimal overhead.

---

### Q: My skill doesn't appear. What's wrong?

**A:** Check these things:

1. **Folder exists**: `~/.file-browser-agent/skills/my-skill/`
2. **File name correct**: Exactly `SKILL.md` (capital S, capital M)
3. **Frontmatter valid**: Starts and ends with `---`
4. **Name format**: kebab-case (lowercase, hyphens only)
5. **Restart app**: Changes require app restart

```bash
# Verify structure
ls ~/.file-browser-agent/skills/my-skill/
# Should show: SKILL.md

# Check file content
cat ~/.file-browser-agent/skills/my-skill/SKILL.md
# Should start with: ---
```

**See:** [Troubleshooting Guide](#troubleshooting)

---

## 🐛 Troubleshooting

### Q: App won't start. What should I do?

**A:** Try these steps:

```bash
# 1. Clear cache and node_modules
rm -r node_modules package-lock.json dist

# 2. Reinstall
npm install
node node_modules/electron/install.js

# 3. Try again
npm run dev
```

If still broken, check:
- Node.js version: `node --version` (should be 20+)
- npm version: `npm --version` (should be 10+)
- API key set: `echo $ANTHROPIC_API_KEY`

---

### Q: App crashes when I type a message

**A:** This might be:

1. **API key issue** - Check it's correct and active
2. **Network issue** - Check internet connection
3. **Bug** - [Report on GitHub](https://github.com/dassi-git/file-browser-agent-skills/issues)

Check the error message for clues:
- Look in VS Code terminal
- Check browser console (F12)
- Note the exact error message

---

### Q: API key doesn't work. What's wrong?

**A:** Try these:

1. **Verify key**: Visit https://console.anthropic.com to confirm key exists
2. **Check format**: Should start with `sk-ant-`
3. **Try copying fresh**: Copy key directly from console (no extra spaces)
4. **Check `.env`**: Make sure `.env` file exists in project root

```bash
# Verify key is set
cat .env | grep ANTHROPIC_API_KEY

# If not there, create it
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env
```

---

### Q: Can't find skills folder. Where is it?

**A:** The folder should be here:

```
C:\Users\{YourUsername}\.file-browser-agent\skills\
```

Replace `{YourUsername}` with your actual Windows username.

**Create it if missing:**
```bash
mkdir "$env:USERPROFILE\.file-browser-agent\skills"
```

---

### Q: TypeScript compilation errors

**A:** This usually means you modified code. To fix:

```bash
# 1. Check errors
npm run typecheck

# 2. Read error messages carefully
# 3. Fix the issues
# 4. Verify
npm run typecheck
```

If stuck, reset to original:
```bash
git checkout src/
npm run typecheck
```

---

## 💻 Development

### Q: Can I modify the code?

**A:** Yes! This is open source. However:

- **Read** [CONTRIBUTING.md](CONTRIBUTING.md) first
- **Follow** code style guidelines
- **Test** your changes: `npm test`
- **Don't forget** TypeScript: `npm run typecheck`

---

### Q: How do I run tests?

**A:**

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode (re-run on changes)
npm test -- --watch
```

---

### Q: Can I contribute?

**A:** Absolutely! We welcome contributions:

1. Fork the repository
2. Create a branch: `git checkout -b feature/my-feature`
3. Make changes
4. Test: `npm test` and `npm run typecheck`
5. Commit with clear message
6. Push and create a Pull Request

**See:** [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 🔒 Security & Privacy

### Q: Is my data private?

**A:** Here's what happens:

- **API key**: Stored locally in `.env` (never committed to git)
- **File contents**: Sent to Anthropic's API for processing
- **Chat history**: Kept locally in app
- **Anthropic**: Follows strict privacy policies ([Anthropic Privacy](https://www.anthropic.com/privacy))

---

### Q: Are my skills secure?

**A:** Skills you create are:

- **Local**: Stored on your computer
- **Private**: Not shared unless you push to GitHub
- **Executable**: Can run scripts and commands

**Warning**: Only install skills from trusted sources. Scripts can do anything on your computer.

---

### Q: Should I commit my API key to git?

**A:** **Absolutely NOT!**

The `.env` file is in `.gitignore` for this reason. Never:

```bash
# ❌ WRONG
git add .env
git commit -m "Add API key"
git push

# ✅ CORRECT
echo ".env" >> .gitignore
# Keep .env private, use documentation instead
```

If you accidentally committed a key:
1. Regenerate it immediately (in Anthropic console)
2. Old key is now invalid
3. Push a commit removing it

---

## 🌐 Networking

### Q: Does this app require internet?

**A:** Yes. The app needs internet to:

- Call Anthropic's Claude API
- Check for updates
- Send/receive chat messages

**Offline mode**: Currently not supported.

---

### Q: Can I use a proxy?

**A:** Not currently. The app directly calls:

```
https://api.anthropic.com/v1/...
```

For proxy support, use environment variable (Node.js feature):

```bash
export HTTP_PROXY=http://proxy.company.com:8080
npm run dev
```

---

## 📊 Performance

### Q: Why is the app slow?

**A:** Slow responses usually mean:

1. **API latency** - Anthropic's server taking time (normal, 2-5 seconds)
2. **Network** - Check your internet connection
3. **Large file** - Selected file very large (try smaller file)
4. **Too many skills** - 100+ skills slows discovery

**Tips to improve:**
- Start small with 5-10 skills
- Keep skill bodies concise
- Close other apps to free memory
- Use reliable internet connection

---

### Q: How can I make skills faster?

**A:**

1. **Keep SKILL.md small** - <5KB ideal
2. **Skip unnecessary details** - Only essential info
3. **Use plain text** - Avoid large images
4. **Organize flat** - Don't nest skill folders
5. **Avoid scripts** - Use external tools instead

**See:** [PERFORMANCE.md](PERFORMANCE.md)

---

## 🎓 Learning

### Q: Where can I learn more?

**A:** Resources in this order:

1. **Quick Start** → [QUICK_START.md](QUICK_START.md) (5 min read)
2. **Examples** → [examples/](examples/) (see real skills)
3. **Architecture** → [ARCHITECTURE.md](../ARCHITECTURE.md) (understand design)
4. **Contributing** → [CONTRIBUTING.md](CONTRIBUTING.md) (build skills)
5. **API Reference** → [API.md](API.md) (technical details)

---

### Q: How do I learn TypeScript?

**A:** Great question! Start with:

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- YouTube tutorials (search "TypeScript for beginners")
- Practice by modifying skills

---

## 🤝 Community

### Q: How do I report a bug?

**A:** Please:

1. Check [GitHub Issues](https://github.com/dassi-git/file-browser-agent-skills/issues)
2. Click "New Issue"
3. Choose "Bug Report"
4. Fill out the template
5. Include error message and steps to reproduce

---

### Q: How do I suggest a feature?

**A:** We'd love to hear ideas!

1. Check [GitHub Discussions](https://github.com/dassi-git/file-browser-agent-skills/discussions)
2. Click "New Discussion"
3. Choose "Ideas"
4. Describe your feature
5. Vote on others' ideas

---

### Q: Can I chat with the maintainers?

**A:** Yes! We're active in:

- **Discussions**: GitHub Discussions tab
- **Issues**: Comment on relevant issues
- **Email**: For security issues only

---

## 📝 Still Have Questions?

**Check these resources:**

- **Docs**: [README_IMPLEMENTATION.md](README_IMPLEMENTATION.md)
- **Discord/Discussions**: [GitHub Discussions](https://github.com/dassi-git/file-browser-agent-skills/discussions)
- **Issues**: [GitHub Issues](https://github.com/dassi-git/file-browser-agent-skills/issues)

**Didn't find your answer?** Open a new discussion or issue!

---

**Last updated**: 2026-09-03

**Have a great time building with File Browser Agent!** 🚀
