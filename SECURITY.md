# Security Policy

## Supported Versions

We actively support the following versions of Eremos:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

The Eremos team takes security seriously. If you discover a security vulnerability, please follow
these steps:

### 🔒 Private Disclosure

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please:

1. **Email us directly** at security@eremos.io (if available) or contact
   [@EremosCore](https://x.com/EremosCore) on Twitter
2. **Provide detailed information** including:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact assessment
   - Suggested fix (if you have one)

### 📋 What to Include

- **Vulnerability Type**: What kind of security issue is it?
- **Location**: Which files/functions are affected?
- **Impact**: What could an attacker do with this vulnerability?
- **Reproduction**: Clear steps to reproduce the issue
- **Environment**: Version numbers, operating system, etc.

### ⏱️ Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution**: Varies based on complexity

### 🛡️ Security Best Practices

When contributing to Eremos:

- Never commit sensitive data (API keys, private keys, passwords)
- Use environment variables for configuration
- Validate all inputs, especially in agent logic
- Follow secure coding practices for blockchain interactions
- Keep dependencies updated

### 🚨 Security Considerations for Agents

Since Eremos deals with blockchain data:

- **Agent Logic**: Ensure agents don't expose sensitive wallet information
- **Signal Data**: Avoid including private keys or sensitive transaction details
- **Memory Storage**: Be cautious about what data agents store
- **Network Requests**: Validate all external API calls

### 🏆 Recognition

Security researchers who responsibly disclose vulnerabilities may be:

- Credited in our security advisories
- Listed in our contributors section
- Invited to our security-focused discussions

Thank you for helping keep Eremos secure! 🛡️
