# Advanced Skills Examples

This directory contains advanced examples of skills demonstrating best practices and advanced patterns.

## 📂 Directory Structure

```
examples/
├── code-analyzer/           # Analyzes code for patterns and issues
├── performance-profiler/    # Profiles application performance
├── data-transformer/        # Transforms data between formats
└── system-auditor/          # Audits system configuration
```

## 🎯 Code Analyzer Skill

**Purpose**: Analyzes code files for quality, complexity, and best practices

### SKILL.md Structure

```markdown
---
name: "code-analyzer"
description: "Analyzes code files for quality, complexity, and potential issues"
tags: ["code-quality", "analysis", "typescript", "javascript"]
author: "Your Name"
version: "1.0.0"
---

# Code Analyzer Skill

## Overview
Performs static analysis on code files to identify:
- Code complexity (cyclomatic complexity)
- Potential bugs and anti-patterns
- Performance issues
- Type safety problems
- Documentation gaps

## Available Commands

### 1. Analyze Complexity
```bash
node analyze-complexity.js "%FILE_PATH%"
```

### 2. Check Type Safety
```bash
npx tsc --noEmit --strict "%FILE_PATH%"
```

### 3. Find Anti-patterns
```bash
python detect-patterns.py "%FILE_PATH%"
```

## Features
- Automatic pattern detection
- Complexity metrics
- Suggestions for improvement
- Performance bottleneck identification

## Usage Example

User: "Analyze this TypeScript file for code quality issues"
→ Agent activates code-analyzer skill
→ Runs analysis commands
→ Returns findings with recommendations
```

## 🚀 Performance Profiler Skill

**Purpose**: Profiles and analyzes performance characteristics

### Key Features

- Memory usage tracking
- Execution time measurement
- Bottleneck identification
- Comparative benchmarking

### Example Implementation

```bash
#!/bin/bash
# measure-performance.sh - Profile script execution

FILE=$1
TIMEOUT=${2:-30}

# Measure execution time
time node "$FILE"

# Measure memory usage
node --expose-gc -e "
  const mem = require('vm');
  const script = require('fs').readFileSync('$FILE', 'utf8');
  console.time('execution');
  eval(script);
  console.timeEnd('execution');
  console.log('Memory used:', process.memoryUsage());
"

# Measure CPU
ps -o %cpu= -p $$
```

## 📊 Data Transformer Skill

**Purpose**: Transforms data between different formats

### Supported Formats

- JSON ↔ CSV
- JSON ↔ XML
- JSON ↔ YAML
- CSV ↔ TSV
- SQL ↔ JSON

### Example Usage

```bash
# Transform JSON to CSV
node transform.js --from json --to csv input.json output.csv

# Transform CSV to JSON with custom delimiter
node transform.js --from csv --to json input.csv output.json --delimiter ";"
```

## 🔍 System Auditor Skill

**Purpose**: Audits system configuration and compliance

### Checks Performed

- Node.js version compatibility
- Required dependencies
- Environment variables
- File permissions
- Port availability
- Disk space
- Memory availability

### Example Check Script

```bash
#!/bin/bash
# audit-system.sh - System audit

echo "=== System Audit Report ==="
echo ""
echo "Node.js Version:"
node --version
echo ""
echo "npm Version:"
npm --version
echo ""
echo "Disk Space:"
df -h .
echo ""
echo "Memory:"
free -h
echo ""
echo "Processes:"
ps aux | head -5
```

## 🏗️ Creating Custom Advanced Skills

### Template Structure

```
my-advanced-skill/
├── SKILL.md                 # Skill definition with frontmatter
├── src/
│   ├── main.ts             # Main execution script
│   ├── utils.ts            # Utility functions
│   └── config.ts           # Configuration
├── scripts/
│   ├── analyze.sh          # Analysis script
│   └── transform.py        # Transformation script
├── tests/
│   └── main.test.ts        # Unit tests
├── README.md               # Detailed documentation
└── package.json            # Dependencies (if needed)
```

### SKILL.md Best Practices

```yaml
---
name: "my-skill"
description: "Clear, concise description"
tags: ["tag1", "tag2"]
author: "Your Name"
version: "1.0.0"
license: "MIT"
repository: "https://github.com/..."
keywords:
  - keyword1
  - keyword2
---
```

### Skill Development Checklist

- [ ] Clear, descriptive SKILL.md
- [ ] All commands fully documented
- [ ] Example usage provided
- [ ] Error handling included
- [ ] Scripts are idempotent
- [ ] Outputs go to working directory
- [ ] No writes to skill folder
- [ ] Works on Windows (or document OS requirements)
- [ ] README with detailed guide
- [ ] Test cases included
- [ ] Performance documented
- [ ] License clearly stated

## 📚 Advanced Patterns

### Pattern 1: Multi-step Analysis

```bash
#!/bin/bash
# Perform analysis in stages with checkpoints

STAGE_1_RESULT=$(analyze-part-1 "$FILE")
if [ $? -ne 0 ]; then
  echo "ERROR: Stage 1 failed"
  exit 1
fi

STAGE_2_RESULT=$(analyze-part-2 "$STAGE_1_RESULT")
if [ $? -ne 0 ]; then
  echo "ERROR: Stage 2 failed"
  exit 1
fi

echo "Final Results:" "$STAGE_2_RESULT"
```

### Pattern 2: Parallel Processing

```bash
#!/bin/bash
# Process multiple files in parallel

for file in *.ts; do
  analyze "$file" &
done
wait

echo "All analyses complete"
```

### Pattern 3: Streaming Output

```bash
#!/bin/bash
# Stream results as they're available

analyze "$FILE" | while read line; do
  echo "[$(date '+%H:%M:%S')] $line"
done
```

### Pattern 4: Conditional Execution

```bash
#!/bin/bash
# Execute based on file type

FILE=$1
EXT="${FILE##*.}"

case "$EXT" in
  ts|js)
    echo "Running TypeScript analysis..."
    npx tsc --noEmit "$FILE"
    ;;
  py)
    echo "Running Python analysis..."
    python -m py_compile "$FILE"
    ;;
  *)
    echo "Unknown file type: $EXT"
    exit 1
    ;;
esac
```

## 🔧 Testing Advanced Skills

### Manual Testing

```bash
# Test activation
npm run dev
# Select a file, ask agent to use the skill
# Verify output appears in chat

# Test integration
git commit -am "test: verify skill integration"
```

### Automated Testing

```bash
# Run skill tests
npm test -- src/main/services/__tests__/skills.test.ts

# Run with coverage
npm test -- --coverage
```

## 📈 Performance Optimization

### For Discovery Phase
- Minimize SKILL.md size (keep body concise)
- Avoid nested directories
- Use descriptive names (aids caching)

### For Lookup Phase
- Skill catalog is O(n) - manageable for <100 skills
- Consider implementing Map-based lookup for >100 skills
- Cache bullet list between requests

### For Tool Activation
- Minimize body size (text is token-expensive)
- Use external file references for large content
- Compress verbose descriptions

## 🚀 Publishing Skills

### To GitHub

```bash
# Create skill repository
git init my-skill
cd my-skill
git add .
git commit -m "Initial commit: my-skill"
git remote add origin https://github.com/yourusername/my-skill.git
git push -u origin main
```

### To Skill Registry (Coming Soon)

```bash
# Will support publishing to skill marketplace
npm run skill:publish
```

## 💡 Tips & Tricks

### Tip 1: Using Environment Variables
```bash
# Access working directory
WORK_DIR="${WORK_DIR:-.}"

# Access file path
FILE_PATH="$1"

# Create temp files safely
TEMP_FILE=$(mktemp)
trap "rm -f $TEMP_FILE" EXIT
```

### Tip 2: Better Error Messages
```bash
function error_exit() {
  echo "ERROR: $1" >&2
  exit "${2:-1}"
}

[[ -f "$FILE" ]] || error_exit "File not found: $FILE" 1
```

### Tip 3: Progress Reporting
```bash
# Show progress for long-running tasks
echo "Processing... (1/3)"
# ...
echo "Processing... (2/3)"
# ...
echo "Processing... (3/3)"
echo "Complete!"
```

## 📖 Additional Resources

- [Skills Documentation](../README_IMPLEMENTATION.md)
- [Architecture Guide](../ARCHITECTURE.md)
- [Best Practices](../CODE_CHANGES.md)

---

**Create amazing skills! Share them with the community!** 🌟
