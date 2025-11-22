# Contributing to Terminium

Thank you for considering contributing to Terminium! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - System information (OS, version, etc.)
   - Screenshots if applicable

### Suggesting Features

1. Check if feature has been suggested
2. Create an issue with:
   - Clear description of the feature
   - Use case / motivation
   - Possible implementation approach
   - Mockups/examples if applicable

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages:** `git commit -m "Add amazing feature"`
6. **Push to your fork:** `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### PR Guidelines

- Keep changes focused and atomic
- Include tests for new features
- Update documentation as needed
- Follow existing code style
- Ensure all tests pass
- Keep commits clean and well-described

## Development Setup

### Client
```bash
cd client
npm install
npm run dev
```

### Server
```bash
cd server/api
npm install
npm start
```

## Coding Standards

### TypeScript/JavaScript
- Use TypeScript for type safety
- Follow ESLint configuration
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### React Components
- Use functional components with hooks
- Keep components small and reusable
- Use styled-components for styling
- Follow component file structure:
  ```tsx
  // Imports
  // Styled components
  // Types/Interfaces
  // Component
  // Export
  ```

### Commit Messages
Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Example: `feat: add SFTP file transfer support`

## Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

### Manual Testing
1. Test on all platforms (Windows, macOS, Linux)
2. Test first-run setup
3. Test SSH connections
4. Test ICMSF import/export
5. Test settings changes

## Documentation

Update documentation when:
- Adding new features
- Changing existing behavior
- Fixing important bugs
- Adding configuration options

Documentation locations:
- `README.md` - Overview and quick start
- `docs/INSTALLATION.md` - Installation instructions
- `docs/USER_GUIDE.md` - User documentation
- `docs/ARCHITECTURE.md` - Technical architecture
- Code comments - Complex logic

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. GitHub Actions builds releases
6. Update release notes on GitHub

## Project Structure

```
terminium/
├── client/           # Electron client app
│   ├── src/
│   │   ├── main/    # Electron main process
│   │   ├── renderer/# React UI
│   │   ├── lib/     # Utilities
│   │   └── types/   # TypeScript types
│   └── package.json
├── server/          # Server-side code
│   ├── api/         # Express API
│   ├── scripts/     # Setup scripts
│   └── config/      # Configuration
├── shared/          # Shared code
├── docs/            # Documentation
└── README.md
```

## Getting Help

- **Documentation:** Check `/docs` folder
- **Issues:** Search existing issues
- **Discussions:** GitHub Discussions for questions
- **Discord:** Join our community server

## Areas for Contribution

### High Priority
- SFTP file transfer implementation
- Port forwarding support
- Snippet/command library
- Multi-factor authentication
- Mobile apps (React Native)

### Medium Priority
- Theme customization
- Plugin system
- Advanced terminal features
- Performance optimizations
- Accessibility improvements

### Good First Issues
Look for issues tagged with `good-first-issue` for beginner-friendly tasks.

## Code Review Process

1. Maintainer reviews PR
2. Feedback provided if needed
3. Changes requested or approved
4. Once approved, PR is merged
5. Contributor gets credit in release notes

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to:
- Open an issue with the `question` label
- Join our Discord server
- Email maintainers

Thank you for contributing to Terminium! 🚀
