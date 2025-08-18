# Metrics

_List of metrics exposed by the system and how to instrument them._

---

## At a Glance

- Scope: Prometheus-style counters, histograms, and gauges used for observability.
- Audience: Operators and developers instrumenting code.

---

## Recommended Metrics

- processed_events_total{agent, outcome}
- signals_emitted_total{agent, type}
- signal_latency_seconds histogram (event -> emit)
- agent_errors_total{agent, type}
- memory_usage_bytes{agent}

---

## Instrumentation Tips

- Increment counters at source of truth.
- Use histograms for latency and quantiles.
- Tag metrics with agent id and environment.

---

## Alerting Suggestions

- High error rate: agent_errors_total rate > threshold
- Signal surge: spikes in signals_emitted_total
- Latency regression: p95(signal_latency_seconds) above SLA

---

## Export & Dashboards

- Use Prometheus + Grafana to visualize metrics.
- Maintain dashboards per agent and a global overview.

---

## Related Docs

- [Runtime](./runtime.md)
- [Architecture](./architecture.md)
