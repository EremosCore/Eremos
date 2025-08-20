# Eremos

![Open Source](https://img.shields.io/badge/Open%20Source-Yes-brightgreen)  
![MIT License](https://img.shields.io/badge/License-MIT-blue)  
![Solana Ecosystem](https://img.shields.io/badge/Built%20for-Solana-blueviolet)

*Eremos is an open design for deploying self-governing "swarm agents" that monitor on-chain activities across the Solana ecosystem to reveal early warning signs before they become bigger issues. It aims to improve understanding and prioritize simplicity for all, created for the public good.*

---

![Eremos Architecture](./images/eremos-architecture.png)

## Quick Links

- [Website](https://www.eremos.io/)  
- [GitHub](https://github.com/EremosCore/Eremos)  
- [Twitter/X](https://x.com/EremosCore)  

---

## Getting Started

1. **Fork this repo:**  
   [Eremos on GitHub](https://github.com/EremosCore/Eremos)

2. **Customize your fork:**  
After forking this project, you don’t have to just copy it, you can make it something you'd like to see!  
- Remake or improve the README to better fit the project’s purpose or audience.  
- Update documentation, add new diagrams, or clarify instructions.  
- Reorganize any folders or files to match a workflow you like.  
- Push your changes to your fork (and send a pull request if you think your improvements would help others!).  

Open source thrives on improvement and personalization, so don’t be afraid to remix!

3. **Install dependencies:**  
This project is built with **TypeScript**, so it requires **TypeScript** and **Node.js type definitions**. All necessary dependencies including TypeScript are installed automatically when you run the following command in your project folder.

To do this:

1. Open your terminal (Command Prompt, PowerShell, or Terminal app).  
2. Navigate to your project folder by running:

    ```
    cd path/to/your/project
    ```

3. Then, run the install command:

    ```
    npm install
    ```

This will download and install all the libraries your project needs to work properly.

4. **Set up your environment file:**  
Most projects need environment variables (like API keys or custom settings) that you configure privately for your own setup.  
- Duplicate the example environment file by running:

    ```
    cp .env.example .env.local
    ```

- Open `.env.local` in your editor and fill in the required fields (e.g., API keys, network URLs, custom options).

**Why?**  
This ensures your project has all the configuration info it needs to run correctly, such as connections to third-party services or your local development environment.  
*If you’re unsure what to enter, check the comments in `.env.example` or ask a project maintainer.*

5. **Run a swarm agent:**  
Eremos is built around autonomous agents that monitor blockchain activity in real time. To start operating, run one or more of these agents.  
- Each agent is an independent Node.js process with modular logic.  
- After installing dependencies and setting up your environment file, start an agent by running:

    ```
    npm run start
    ```

- This command launches the default swarm agent which scans blockchain data sources according to the logic in the `/agents` folder.  
- You can run multiple agents simultaneously by starting separate processes or customizing agent configurations.  
- Logs and signals emitted by agents display in your terminal, helping you monitor wallet activity, contract deployments, or anomalies.  
- For development and customization, explore the `/agents` directory to create or modify agents tailored to your monitoring needs.

**Tip:** To stop an agent, press `Ctrl+C` in the terminal. Restarted agents continue scanning from the last known state based on saved checkpoints.

_For detailed info on each agent’s configuration, signal types, and extending swarm capabilities, visit the [official docs](https://github.com/EremosCore/Eremos/tree/main/docs) and the `/agents` folder._

6. **Check logs and outputs:**  
Each agent tracks activity and highlights relevant signals in real time.

*For detailed setup, visit our [agent folder on GitHub](https://github.com/EremosCore/Eremos/tree/main/agents).*

---

## What Are Swarm Agents?  
> Self-governing bots that monitor money flows, identify trends, and provide rapid information allowing developers and analysts to take quicker action.

Agents can:  
- Monitor blockchain updates continuously.  
- Detect unusual or large transfers.  
- Compile trend data for research and alerts.

---

## Contribution Guide

Contributors are very important to us!  
- Watch and star this repository.  
- Make your modifications after forking.  
- Open a pull request (PR) and attach images for big changes.  
- Need help? [Open an issue](https://github.com/EremosCore/Eremos/issues) or send a DM to us on Twitter.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for more tips.

---

## FAQ

**Q: Is this for beginners?**  
A: Yes! Eremos is designed for all skill levels.

**Q: Where can I ask questions?**  
A: GitHub Issues, Twitter/X, or join our community on [Discord](#).

---

## License

MIT

---

## Special Thanks

The open-source community makes Eremos possible. Everyone is welcome to contribute to shaping its future!

[CONTRIBUTING.md](./CONTRIBUTING.md)

---

# Contributing to Eremos

Thank you for your interest in improving Eremos!

## How to Contribute

1. Fork the repository  
2. Create a new branch for your change  
3. Make edits or improvements  
4. Commit changes and open a Pull Request (PR)  
   - Explain *why* your change is helpful.  
   - Attach screenshots if you changed or added diagrams!

## Tips

- Keep PRs clean and focused.  
- Use clear commit messages (e.g., “Improved README with new diagram”).  
- Be kind and constructive in comments.

## Help

If you get stuck, open an issue or ask for help on [Twitter](https://twitter.com/EremosCore). Every contribution counts!
