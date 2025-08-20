# Contributing to Eremos

Thank you for your interest in contributing! We welcome new agents, signal logic, and utility improvements.

## How to Contribute

1. **Fork the Repository**
   - Click the "Fork" button on GitHub and clone your fork locally:
     ```bash
     git clone https://github.com/YOUR_USERNAME/Eremos.git
     cd Eremos
     ```
2. **Create a New Branch**
   - Use a descriptive branch name:
     ```bash
     git checkout -b feature/your-feature-name
     ```
3. **Make Changes**
   - Add new agents in `/agents` or update logic as needed.
   - Use `/agents/example.ts` as a scaffold for new agents.
   - Simulate/test agents with `/scripts/dev-agent.ts`.

4. **Test Locally**
   - Ensure your code runs and passes any tests:
     ```bash
     npm install
     npm run dev
     # or run specific test scripts if available
     ```

5. **Code Style**
   - Follow the formatting rules in `.editorconfig` and `.prettierrc`.
   - Keep logic modular and commits clean.

6. **Push and Create a Pull Request**
   - Push your branch and open a PR on GitHub.

## Notes
- Avoid unnecessary bloat and keep PRs focused.
- For design/creative contributions, DM us on Twitter [@EremosCore](https://x.com/EremosCore).