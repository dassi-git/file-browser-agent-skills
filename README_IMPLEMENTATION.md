# File Browser Agent with Skills Support 🚀

A sophisticated Windows desktop application that combines a file browser UI with an AI-powered chat agent. The agent provides expert guidance for specific tasks through a dynamic **Skills** system.

## Overview

This project demonstrates how to:
- Implement a **Skills Discovery System** that allows the model to discover specialized instructions
- Use **Tool Calling** to activate skills on-demand
- Build a modern Electron + TypeScript + React application with streaming AI responses
- Integrate the Anthropic Messages API for intelligent tool execution

## Key Features

✨ **Skills Support**: The agent automatically discovers and uses specialized instructions for specific tasks
- Skills are modular SKILL.md files stored in `~/.file-browser-agent/skills/`
- Each skill has metadata (name, description) and detailed instructions (body)
- The model intelligently selects relevant skills based on task requirements

🔍 **File Browser Integration**: Navigate and interact with your file system
- Real-time file selection with metadata display
- Preview files with the load_file tool
- Execute commands with user approval

💬 **Streaming Chat**: Real-time AI responses with visual feedback
- Stream tokens as they arrive
- Tool execution feedback and status updates
- Conversation history management

## Project Structure

```
src/
├── main/
│   ├── index.ts                    # Main process entry point
│   ├── services/
│   │   ├── agent-tools.ts          # Tool definitions (includes activate_skill)
│   │   ├── anthropic-chat.ts       # Chat runner with streaming
│   │   ├── skills.ts               # Skills discovery & store
│   │   ├── fs-service.ts           # File system operations
│   │   └── ...                     # Other services
│   └── ipc/
│       ├── skill-handlers.ts       # IPC handlers for skill operations
│       └── ...
├── renderer/
│   └── ...                         # React UI components
└── shared/
    └── types.ts                    # Shared TypeScript types
```

## How Skills Work

### Phase 1: Discovery
The `SkillsStore` class scans `~/.file-browser-agent/skills/` for folders containing `SKILL.md` files:

```typescript
// Example: ~\.file-browser-agent\skills\example-skill\SKILL.md
---
name: "example-skill"
description: "A sample skill demonstrating file analysis"
---
# Skill Content...
```

### Phase 2: Catalog Exposure
The agent's `activate_skill` tool exposes available skills:

```typescript
betaTool({
  name: "activate_skill",
  description: "Available skills: ...",
  // When called, returns the full skill instructions
})
```

### Phase 3: Smart Selection
The model intelligently calls `activate_skill` when a task matches a skill's purpose:

```
User: "Analyze this JavaScript file for performance issues"
Agent: Recognizes this matches a hypothetical "code-analyzer" skill
Agent: Calls activate_skill with name="code-analyzer"
Agent: Receives full instructions and executes the analysis
```

## Installation

### Prerequisites
- Node.js 20+
- npm 10+
- Windows OS
- Anthropic API Key

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/malbruk/dovrot-ai-projects.git
   cd dovrot-ai-projects/09-skills/files-browser-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   node node_modules/electron/install.js
   ```

3. **Create skills directory**
   ```bash
   mkdir "$env:USERPROFILE\.file-browser-agent\skills"
   ```

4. **Set up API Key**
   Create a `.env` file in the project root:
   ```env
   ANTHROPIC_API_KEY=sk-ant-...
   ```
   Or enter it interactively on first app launch.

5. **Run the application**
   ```bash
   npm run dev
   ```

## Skills Folder Structure

Each skill is a directory with a `SKILL.md` file:

```
~\.file-browser-agent\
└── skills\
    ├── example-skill\
    │   ├── SKILL.md              # Frontmatter + instructions
    │   ├── script.py             # Optional supporting scripts
    │   └── data.json             # Optional data files
    └── another-skill\
        └── SKILL.md
```

### Creating a Skill

1. Create a folder: `~\.file-browser-agent\skills\my-skill\`
2. Create `SKILL.md` with frontmatter:

```markdown
---
name: "my-skill"
description: "Brief description of what this skill does"
---

# Full Instructions

Detailed instructions for the model on how to use this skill...

## Available Commands

- Command 1: description
- Command 2: description
```

3. (Optional) Add supporting scripts or data files
4. The skill is automatically discovered on app startup

## Core Concepts

### The activate_skill Tool

This tool is the bridge between the agent and skills:

- **Input**: skill name (string)
- **Output**: complete skill body with instructions
- **Behavior**: Returns error if skill not found; includes folder location and working directory info

### SkillsStore

Singleton class managing skill lifecycle:

```typescript
// Load skills from disk
await SKILLS_STORE.reload()

// Get a skill by name
const skill = SKILLS_STORE.getByName("example-skill")

// Get all available skills
const list = SKILLS_STORE.listAvailable()

// Get markdown bullet list for the model
const catalog = SKILLS_STORE.getBulletList()
```

### System Prompt Integration

The system prompt instructs the model to use skills strategically:

```
"When a task matches a skill's description, 
call the activate_skill tool with the skill's name 
to load its full instructions."
```

## Building & Development

### Development Server
```bash
npm run dev
```

### Type Checking
```bash
npm run typecheck
npm run typecheck:node    # Main process only
npm run typecheck:web     # Renderer only
```

### Production Build
```bash
npm run build
npm run start              # Run built app
```

## API Integration

The application uses:
- **Anthropic Messages API**: For streamed AI responses
- **Tool Runner**: For agentic loops with tools
- **Files API (Beta)**: For file attachments in conversations
- **Tool Calling**: For structured tool invocation

### Key Features

- ✅ Streaming responses
- ✅ Tool use in loops (up to 20 iterations)
- ✅ File attachments (PDFs, images, documents)
- ✅ Structured JSON schemas for tools
- ✅ Error handling and retries

## Example: Using the Application

### Scenario: Analyze a File

1. **Select a file** in the file browser
2. **Ask the agent**: "Analyze this file for security issues"
3. **Agent detects** a "security-analyzer" skill matches this task
4. **Agent calls** `activate_skill("security-analyzer")`
5. **Agent receives** detailed security analysis instructions
6. **Agent executes** the analysis using available tools
7. **Agent streams** results back to the UI

### Scenario: Add a New Skill

1. Create `~\.file-browser-agent\skills\my-skill\SKILL.md`
2. Add metadata and instructions
3. Restart the app (or wait for next reload)
4. Agent automatically discovers and can use the skill

## Architecture Highlights

### Tool Loop
The agent runs a tool-use loop:
1. Generate response with available tools
2. Parse tool calls from response
3. Execute tools (with user approval for commands)
4. Add results to conversation
5. Repeat until agent signals completion

### IPC Bridge
Electron IPC channels enable secure communication:
- `skill:list` - Get available skills
- `skill:add` - Install skill from .zip
- `chat:send` - Send message to agent
- `chat:event` - Stream events (text, tool results, errors)

### File Upload
The Files API (Beta) enables:
- Drag-drop file support
- Native PDF/image rendering
- Efficient token usage for large files

## Troubleshooting

### App won't start
- Check Node.js version (20+)
- Ensure Electron is installed: `node node_modules/electron/install.js`
- Check API key is set

### Skills not discovered
- Verify folder exists: `~\.file-browser-agent\skills\`
- Check SKILL.md files have valid frontmatter
- Restart app to reload skills

### Chat errors
- Check API key in .env or app settings
- Verify internet connection
- Check browser console for errors

## Learning Resources

### Anthropic Documentation
- [Messages API](https://docs.anthropic.com/en/api/messages)
- [Tool Use](https://docs.anthropic.com/en/docs/build-a-system-prompt-with-tool-use)
- [Files API (Beta)](https://docs.anthropic.com/en/docs/build-a-system-prompt-with-files)

### Project Files to Study
1. **skills.ts** - Skill discovery implementation
2. **agent-tools.ts** - Tool definitions including activate_skill
3. **anthropic-chat.ts** - Streaming chat with tool loops
4. **skill-handlers.ts** - IPC handlers for skill operations

## The Big Picture

Skills demonstrate a powerful pattern:

```
┌─────────────────────────────────────────────┐
│          User's Task Request                │
└──────────────────┬──────────────────────────┘
                   │
           ┌───────▼────────┐
           │  Model Decides │
           │ Which Tool Use?│
           └───────┬────────┘
                   │
          ┌────────┴────────┐
          │                 │
      (No Skill)      (Skills Apply)
          │                 │
       Use Tools        Activate Skill
                            │
                   ┌────────▼────────┐
                   │  Load Full      │
                   │  Instructions   │
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐
                   │  Execute Using  │
                   │  Available Tools│
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐
                   │  Return Results │
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐
                   │ Stream to User  │
                   └─────────────────┘
```

**No special model training required.** Any model with tool-calling support can use skills!

## Implementation Checklist

- ✅ Phase 1: Implement `loadSkills()` function
  - Scan `~/.file-browser-agent/skills/` for folders
  - Parse SKILL.md frontmatter (name, description)
  - Extract body content
  - Store in `SkillsStore`

- ✅ Phase 2: Expose catalog to model
  - Add `activate_skill` tool to `makeTools()`
  - Include skills catalog in tool description
  - Return full body when skill activated

- ✅ Phase 3: Integration
  - Uncomment `await SKILLS_STORE.reload()` in index.ts
  - Uncomment `skill:list` handler in skill-handlers.ts
  - Uncomment `await SKILLS_STORE.reload()` in skill-handlers.ts

## What's Next?

Extend the system with:
- **Skill marketplace**: Download pre-built skills
- **Skill versioning**: Manage skill versions
- **Skill validation**: Test skills before installation
- **Skill dependencies**: Handle skill-to-skill calls
- **Skill UI**: Visual skill configuration/management
- **Analytics**: Track skill usage and effectiveness

## License

MIT

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## Support

- 📖 See SPEC.md for detailed specifications
- 🎓 Follow the starter video for step-by-step implementation
- 💬 Check GitHub discussions for community questions

---

**Happy building! Remember: Skills aren't magic—they're just organized instructions delivered at the right time.** ✨
