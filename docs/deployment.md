# Deployment

_Guide for deploying Eremos in dev and production environments._

---

## At a Glance

- Scope: Local dev, containerized deployment, and production best practices.
- Audience: DevOps and maintainers.
- Prereqs: Docker, Kubernetes (optional), cloud infra knowledge.

---

## Environments

- Local: single-process, in-process bus, `.env.local` configuration.
- Staging: containerized, single-region, Redis for short-term state.
- Production: multi-region, Kafka/Redis broker, managed Postgres/Timescale.

---

## Quick Deploy (Docker)

```bash
# build
docker build -t eremos:latest .
# run with env file
docker run --env-file .env.production -p 3000:3000 eremos:latest
```

---

## Kubernetes (high level)

- Containerize services: orchestrator, watchers, agent workers.
- Use a message broker (Redis/Kafka) for cross-pod signal delivery.
- Deploy Postgres/Timescale for historical storage.
- Use HPA based on queue length/CPU.

---

## Configuration & Secrets

- Store secrets in vaults (AWS Secrets Manager, HashiCorp Vault).
- Never commit `.env` to source.
- Use RBAC for cluster security.

---

## Scaling Notes

- Shard chain watchers by subscription topics.
- Autoscale agent workers by backlog length or processing latency.
- Offload heavy inference (ML) to separate services.

---

## Rollback & Monitoring

- Use blue/green or canary deployments.
- Keep health checks and readiness probes for orchestrator and watchers.
- Monitor SLOs: signal latency, errors, and processed_events_total.

---

## Troubleshooting

- Pod restarts: check memory limits and logs.
- Event lag: increase replicas or reduce throughput per shard.
- Database contention: tune indices and retention policies.

---

## Related Docs

- [Architecture](./architecture.md)
- [Runtime](./runtime.md)
