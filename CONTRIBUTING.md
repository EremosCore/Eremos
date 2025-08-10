📋 How to Contribute
1. Fork the Repository
Click the Fork button on the top right of this page and clone your fork locally:

git clone https://github.com/EremosCore/Eremos
cd Eremos
2. Create a New Branch
Name your branch clearly based on the change:


git checkout -b feature/add-agent-template

or


git checkout -b fix/docs-formatting
3. Install Dependencies

npm install
4. Make Your Changes
Keep your code clean and modular.

Follow the existing folder structure (/agents, /utils, /types, /docs).

Use Prettier for consistent formatting:


npm run format
5. Test Your Changes
Make sure all tests pass before submitting:



npm run test
6. Commit Your Changes
Write clear and concise commit messages:


git commit -m "feat: add CEX-origin funding signal parser"
7. Push to Your Fork


git push origin feature/add-agent-template
8. Open a Pull Request
Go to your fork on GitHub

Click Compare & Pull Request

Clearly describe the purpose and context of your changes

Reference related issues if applicable

📐 Coding Guidelines
Language: TypeScript (strict mode enabled)

Style: Use Prettier config in repo

Commits: Follow Conventional Commits

Tests: Every new feature must include tests in /tests

🧪 Testing
We use Jest for unit tests. Run:

npm run test
Tests live in the /tests directory and should follow the naming pattern:

<module>.test.ts
📖 Documentation
If your change impacts usage, update the relevant documentation in:

/docs folder

README.md

🤝 Code of Conduct
We follow the Contributor Covenant to ensure a welcoming and harassment-free experience for everyone.

📜 License
By contributing, you agree that your contributions will be licensed under the MIT License.