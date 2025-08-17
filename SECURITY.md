# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Reporting a Vulnerability

We take the security of Eremos seriously. If you believe you have found a security vulnerability, please report it to us as described below.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to [security@eremos.io](mailto:security@eremos.io).

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the requested information listed below (as much as you can provide) to help us better understand the nature and scope of the possible issue:

- **Type of issue** (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- **Full paths of source file(s) related to the vulnerability**
- **The location of the affected source code** (tag/branch/commit or direct URL)
- **Any special configuration required to reproduce the issue**
- **Step-by-step instructions to reproduce the issue**
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the issue**, including how an attacker might exploit it**

This information will help us triage your report more quickly.

## Preferred Languages

We prefer all communications to be in English.

## Policy

Eremos follows the principle of [Responsible Disclosure](https://en.wikipedia.org/wiki/Responsible_disclosure).

## Security Best Practices

When using Eremos in production environments, we recommend:

1. **Keep dependencies updated**: Regularly update your dependencies to get the latest security patches
2. **Use environment variables**: Store sensitive configuration in environment variables, not in code
3. **Network security**: Use HTTPS and secure WebSocket connections when possible
4. **Access control**: Implement proper authentication and authorization for your agents
5. **Monitoring**: Set up monitoring and alerting for unusual activity
6. **Regular audits**: Conduct regular security audits of your deployment

## Security Features

Eremos includes several security features:

- **Type safety**: Full TypeScript implementation reduces runtime vulnerabilities
- **Input validation**: Comprehensive event and signal validation
- **Rate limiting**: Built-in throttling to prevent abuse
- **Memory isolation**: Agent memory is isolated to prevent data leakage
- **Secure defaults**: Security-focused default configurations

## Disclosure Timeline

- **48 hours**: Initial response to vulnerability report
- **7 days**: Assessment and triage completion
- **30 days**: Fix development and testing
- **90 days**: Public disclosure (if not fixed)

## Credits

We would like to thank all security researchers and contributors who responsibly disclose vulnerabilities to us.

## Contact

- **Security Email**: [security@eremos.io](mailto:security@eremos.io)
- **PGP Key**: [Available on request](mailto:security@eremos.io)
- **GitHub Security Advisories**: [GitHub Security](https://github.com/EremosCore/Eremos/security/advisories)

## License

This security policy is licensed under the same terms as the Eremos project (MIT License).
