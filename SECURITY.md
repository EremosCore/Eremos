# Security Policy

## Supported Versions

We actively support the following versions of Eremos:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities in Eremos seriously. If you discover a security vulnerability, please follow these steps:

### For Critical Vulnerabilities

1. **Do not** create a public GitHub issue
2. Email us directly at security@eremos.io
3. Include a detailed description of the vulnerability
4. Provide steps to reproduce the issue
5. Include any relevant code examples or proof of concept

### For Non-Critical Issues

1. Create a GitHub issue with the `security` label
2. Provide a clear description of the potential security concern
3. Include steps to reproduce if applicable

## Response Timeline

- **Acknowledgment**: Within 24 hours
- **Initial Assessment**: Within 72 hours  
- **Status Updates**: Every 7 days until resolved
- **Fix Release**: Target within 30 days for critical issues

## Security Best Practices

When developing with Eremos:

### Agent Development
- Validate all input data in `observe()` functions
- Use proper error handling to prevent crashes
- Avoid logging sensitive blockchain data
- Implement rate limiting for high-frequency agents

### Environment Security
- Never commit private keys or secrets
- Use environment variables for sensitive configuration
- Regularly update dependencies
- Monitor agent behavior for anomalies

### Signal Handling
- Sanitize signal payloads before logging
- Implement proper access controls for signal endpoints
- Use HTTPS for all external communications
- Validate signal authenticity when consuming externally

## Known Security Considerations

### Agent Isolation
- Agents currently share memory space
- Future versions will implement better isolation
- Be cautious with shared utilities and global state

### Signal Integrity
- Signal hashes provide basic integrity checking
- Consider additional signature schemes for critical applications
- Verify signal source when consuming externally

### RPC Security
- Agents may interact with blockchain RPC endpoints
- Use trusted RPC providers
- Implement proper API key management
- Rate limit RPC calls to avoid abuse

## Disclosure Policy

We believe in responsible disclosure:

1. We will acknowledge receipt of vulnerability reports
2. We will provide regular status updates during investigation
3. We will credit researchers who responsibly disclose vulnerabilities
4. We will publish security advisories for confirmed vulnerabilities

## Contact

For security-related inquiries:
- Email: security@eremos.io
- Twitter: [@EremosCore](https://x.com/EremosCore) (for public security discussions)
- GitHub: Create an issue with `security` label (for non-sensitive reports)

---

Thank you for helping keep Eremos secure! 🔐
