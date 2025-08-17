# Pull Request

## Description

<!-- Provide a clear and concise description of what this PR does -->

### Type of Change

<!-- Mark the relevant option with an "x" -->

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🔧 Maintenance (dependency updates, code cleanup, etc.)
- [ ] 🤖 New agent implementation
- [ ] 🔄 Agent modification/enhancement

### Related Issues

<!-- Link to related issues using "Fixes #123" or "Closes #123" -->

- Fixes #
- Related to #

## Changes Made

<!-- Describe the specific changes made in this PR -->

### Core Changes

- [ ] Change 1: Description
- [ ] Change 2: Description
- [ ] Change 3: Description

### Files Modified

<!-- List the main files that were modified -->

- `path/to/file1.ts` - Description of changes
- `path/to/file2.ts` - Description of changes

## Agent-Specific Changes (if applicable)

<!-- Complete this section if your PR involves agent development -->

### Agent Details

- **Agent Name**:
- **Agent Type**: [ ] New Agent [ ] Existing Agent Modification
- **Category**: [ ] DeFi [ ] NFT [ ] Governance [ ] Security [ ] Other: \_\_\_

### Agent Implementation Checklist

- [ ] Agent follows established patterns and conventions
- [ ] Agent implements proper signal emission
- [ ] Agent includes appropriate memory management
- [ ] Agent configuration is properly typed
- [ ] Agent includes error handling and validation
- [ ] Agent integrates with existing utility functions

### Signal Implementation

- [ ] New signals are properly defined in types
- [ ] Signal emission follows established patterns
- [ ] Signal data structures are documented
- [ ] Signals include appropriate metadata

## Testing

### Test Coverage

- [ ] Unit tests added/updated for new functionality
- [ ] Integration tests added/updated where applicable
- [ ] Agent-specific tests implemented (if applicable)
- [ ] All existing tests pass
- [ ] Test coverage maintained or improved

### Manual Testing

- [ ] Tested locally with sample data
- [ ] Verified agent behavior in development environment (if applicable)
- [ ] Tested edge cases and error conditions
- [ ] Verified performance impact is acceptable

### Test Commands Run

<!-- List the test commands you ran -->

```bash
# Example:
npm test
npm run test:agents
npm run lint
```

## Code Quality

### Code Standards

- [ ] Code follows TypeScript best practices
- [ ] Code follows established project conventions
- [ ] ESLint passes without errors
- [ ] Prettier formatting applied
- [ ] No console.log statements left in production code
- [ ] Appropriate error handling implemented

### Documentation

- [ ] Code is properly commented where necessary
- [ ] Complex logic is explained with comments
- [ ] Public APIs are documented
- [ ] README updated if necessary
- [ ] Agent documentation added/updated (if applicable)

### Performance & Security

- [ ] No obvious performance regressions
- [ ] No security vulnerabilities introduced
- [ ] Memory usage is reasonable
- [ ] No sensitive data exposed in logs

## Breaking Changes

<!-- If this PR introduces breaking changes, describe them here -->

### Breaking Change Details

- [ ] No breaking changes
- [ ] Breaking changes documented below

<!-- If breaking changes exist, describe: -->
<!-- - What breaks -->
<!-- - Why the change was necessary -->
<!-- - How users should migrate -->

### Migration Guide

<!-- Provide migration instructions if breaking changes exist -->

## Documentation Updates

### Documentation Changes

- [ ] No documentation changes needed
- [ ] Documentation updated in this PR
- [ ] Documentation updates needed in separate PR

### Updated Documentation

- [ ] README.md updated
- [ ] API documentation updated
- [ ] Agent development guide updated (if applicable)
- [ ] Architecture documentation updated
- [ ] Examples updated

## Deployment Considerations

### Environment Impact

- [ ] No environment changes required
- [ ] New dependencies added (listed below)
- [ ] Configuration changes required
- [ ] Database/storage changes required

### New Dependencies

<!-- List any new dependencies added -->

- `package-name@version` - Purpose/justification

## Review Checklist

### For Reviewers

- [ ] Code review completed
- [ ] Architecture and design reviewed
- [ ] Security implications considered
- [ ] Performance impact assessed
- [ ] Documentation adequacy verified
- [ ] Test coverage verified

### Agent Review (if applicable)

- [ ] Agent logic and algorithms reviewed
- [ ] Signal emission patterns verified
- [ ] Memory management reviewed
- [ ] Integration points validated
- [ ] Performance characteristics assessed

## Additional Notes

<!-- Any additional information that reviewers should know -->

### Screenshots/Examples

<!-- Include screenshots, code examples, or output samples if helpful -->

### Future Work

<!-- Mention any follow-up work or related PRs -->

---

## Pre-Submission Checklist

<!-- Confirm all items before submitting -->

- [ ] I have read and followed the contribution guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings or errors
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published

### Agent-Specific Pre-Submission (if applicable)

- [ ] Agent follows the established agent development patterns
- [ ] Agent has been tested with realistic data scenarios
- [ ] Agent performance has been evaluated
- [ ] Agent documentation is complete and accurate
- [ ] Agent integrates properly with existing ecosystem
