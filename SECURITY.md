# Security Policy

## 🔒 Reporting Security Issues

If you discover a security vulnerability in the File Browser Agent project, please report it responsibly.

### ⚠️ DO NOT

- Create public GitHub issues for security vulnerabilities
- Post vulnerabilities on public forums
- Exploit vulnerabilities in production environments

### ✅ DO

1. **Email us privately** at security@example.com with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if you have one)

2. **Include details**:
   - Affected version(s)
   - Proof of concept
   - Your contact information

### ⏱️ Timeline

- **Acknowledgment**: Within 48 hours
- **Assessment**: Within 1 week
- **Fix development**: 1-4 weeks depending on severity
- **Release**: Security patch released when fix is ready
- **Notification**: All users notified of patch availability

## 🛡️ Security Best Practices

### For Users

1. **Keep Updated**
   - Always use the latest version
   - Subscribe to security advisories
   - Review CHANGELOG.md for security fixes

2. **API Keys**
   - Never commit API keys to repositories
   - Use `.env` files (added to `.gitignore`)
   - Rotate keys periodically
   - Use read-only keys when possible

3. **Skills**
   - Only install skills from trusted sources
   - Review SKILL.md before activation
   - Audit skill commands before running
   - Keep skills updated

4. **System Security**
   - Run on secure systems
   - Use Windows Defender or equivalent
   - Keep Node.js and npm updated
   - Run with minimal required permissions

### For Contributors

1. **Code Review**
   - All PRs require review
   - Security-focused review for sensitive changes
   - Test edge cases and malicious inputs

2. **Dependencies**
   - Keep dependencies updated
   - Review security advisories: `npm audit`
   - Use exact versions where possible
   - Lock package versions

3. **Secrets Management**
   - Never log sensitive data
   - Use environment variables
   - Implement input validation
   - Sanitize error messages

## 📋 Security Checklist

Before releasing a new version:

- [ ] Run `npm audit` - no vulnerabilities
- [ ] TypeScript compile - 0 errors
- [ ] No hardcoded secrets in code
- [ ] No console.logs of sensitive data
- [ ] Dependencies up to date
- [ ] No bypass of authentication/validation
- [ ] Error handling doesn't leak info
- [ ] Input validation on all untrusted data

## 🔐 Secure Coding Guidelines

### Input Validation

```typescript
// ❌ Unsafe
const skill = userInput;

// ✅ Safe
const skill = sanitizeSkillName(userInput);
if (!isValidSkillName(skill)) {
  throw new Error('Invalid skill name');
}
```

### Error Handling

```typescript
// ❌ Unsafe - leaks file paths
catch (error) {
  console.log(`Failed to load ${skillPath}: ${error.message}`);
}

// ✅ Safe - generic message
catch (error) {
  console.error('Failed to load skill');
  // Log details to secure log, not console
}
```

### Secrets Management

```typescript
// ❌ Unsafe
const apiKey = process.env.ANTHROPIC_API_KEY;
console.log(`Using key: ${apiKey}`);

// ✅ Safe
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  throw new Error('ANTHROPIC_API_KEY not set');
}
// Never log the key itself
```

## 🚨 Known Issues

Currently no known security issues. If you discover one, please report it following the process above.

## 📚 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [npm Security](https://docs.npmjs.com/getting-started/fixing-npm-permissions)
- [Electron Security](https://www.electronjs.org/docs/tutorial/security)

## 🔄 Version Support

### Supported Versions

| Version | Supported | Security Updates |
|---------|-----------|------------------|
| 1.0.x   | ✅ Yes    | ✅ Yes          |
| 0.9.x   | ❌ No     | ❌ No           |

Security updates will be released for the current major version.

## 📞 Contact

For security inquiries:
- 📧 Email: security@example.com
- 🐛 GitHub Security Advisory: Report via GitHub
- 💬 Discussions: GitHub Discussions (non-urgent)

---

**Thank you for helping keep File Browser Agent secure!** 🙏
