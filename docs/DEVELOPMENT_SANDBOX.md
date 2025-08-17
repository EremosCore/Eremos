# Developer Sandbox

Spin up a local Solana testnet and Eremos agent for rapid development.

## Prerequisites

- Docker & Docker Compose

## Usage

```sh
docker-compose up
```

- Access Solana testnet at `localhost:8899`
- Eremos agent runs with example configs from `/examples`

## Customization

- Edit `docker-compose.yml` to add more agents or adapters.
- Mount your own configs via the `volumes` section.

## Troubleshooting

- Ensure Docker is running.
- Check logs with `docker-compose logs`.
