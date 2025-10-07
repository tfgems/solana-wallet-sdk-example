# Contributing to Phantom Wallet SDK Example

Thank you for your interest in contributing to this Phantom Wallet SDK example! This project serves as a reference implementation for Solana dApp development.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/phantom-wallet-sdk-example.git
   cd phantom-wallet-sdk-example
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Development Guidelines

### Code Style
- Use modern React patterns (hooks, functional components)
- Follow consistent naming conventions
- Add comprehensive error handling
- Include TypeScript-style JSDoc comments
- Maintain responsive design principles

### Component Structure
- Keep components focused and single-purpose
- Use custom hooks for shared logic
- Implement proper error boundaries
- Follow the existing file structure:
  ```
  src/
  ├── components/     # React UI components
  ├── hooks/          # Custom React hooks
  ├── utils/          # Helper functions
  └── App.jsx         # Main application
  ```

### Testing
- Test wallet connection flows
- Verify transaction signing
- Test error scenarios
- Ensure responsive design works

## Contribution Types

### Bug Fixes
- Fix wallet connection issues
- Resolve UI/UX problems
- Address security vulnerabilities
- Improve error handling

### Features
- Add new Solana program interactions
- Implement additional wallet features
- Enhance UI components
- Add new utility functions

### Documentation
- Improve README clarity
- Add code comments
- Create usage examples
- Update API documentation

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code patterns
   - Add appropriate error handling
   - Test thoroughly

3. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Provide clear description
   - Include testing steps
   - Reference any related issues

## Code Review Guidelines

### What We Look For
- ✅ Clean, readable code
- ✅ Proper error handling
- ✅ Responsive design
- ✅ Security best practices
- ✅ Performance considerations

### What We Avoid
- ❌ Hardcoded private keys or secrets
- ❌ Mainnet transactions in examples
- ❌ Breaking changes without discussion
- ❌ Unused dependencies
- ❌ Poor error messages

## Security Considerations

- **Never commit private keys or mnemonics**
- **Use Devnet for all examples**
- **Validate all user inputs**
- **Handle wallet disconnections gracefully**
- **Follow Phantom's security guidelines**

## Questions?

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones
- Provide detailed reproduction steps for bugs
- Include environment details (browser, OS, etc.)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for helping make this example better for the Solana developer community! 🚀
