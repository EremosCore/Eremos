# Deployment Guide 🚀

This guide covers deploying Eremos agents in various environments, from local development to production clusters.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Production Checklist](#production-checklist)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### System Requirements

- **Node.js** 18+
- **npm** 8+ or **yarn** 1.22+
- **Git** for version control
- **Docker** (for containerized deployment)
- **Kubernetes** (for orchestrated deployment)

### Environment Setup

```bash
# Clone the repository
git clone https://github.com/EremosCore/Eremos.git
cd Eremos

# Install dependencies
npm install

# Set up environment
cp config/development.ts config/local.ts
```

## 🏠 Local Development

### Quick Start

```bash
# Start development mode
npm run dev

# Test a specific agent
npm run dev:agent -- --agent=observer --duration=60

# Run tests
npm test
```

### Development Configuration

Create a local configuration file:

```typescript
// config/local.ts
import { developmentConfig } from './development';

export const localConfig = {
  ...developmentConfig,
  development: {
    ...developmentConfig.development,
    devModeEnabled: true,
    devAgentName: 'observer',
  },
  logging: {
    ...developmentConfig.logging,
    level: 'debug',
  },
};
```

### Local Database Setup

```bash
# Install PostgreSQL (if using persistent storage)
brew install postgresql  # macOS
sudo apt-get install postgresql  # Ubuntu

# Start PostgreSQL
brew services start postgresql

# Create database
createdb eremos
```

## 🐳 Docker Deployment

### Single Container

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "start"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  eremos:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
    volumes:
      - ./config:/app/config
      - ./logs:/app/logs
    restart: unless-stopped
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: eremos
      POSTGRES_USER: eremos_user
      POSTGRES_PASSWORD: your_secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - '5432:5432'

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data

  prometheus:
    image: prom/prometheus:latest
    ports:
      - '9090:9090'
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus

  grafana:
    image: grafana/grafana:latest
    ports:
      - '3001:3000'
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  postgres_data:
  redis_data:
  prometheus_data:
  grafana_data:
```

### Build and Run

```bash
# Build the image
docker build -t eremos:latest .

# Run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f eremos

# Scale agents
docker-compose up -d --scale eremos=3
```

## ☸️ Kubernetes Deployment

### Namespace

```yaml
# k8s/namespace.yml
apiVersion: v1
kind: Namespace
metadata:
  name: eremos
  labels:
    name: eremos
```

### ConfigMap

```yaml
# k8s/configmap.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eremos-config
  namespace: eremos
data:
  NODE_ENV: 'production'
  SOLANA_RPC_URL: 'https://api.mainnet-beta.solana.com'
  LOG_LEVEL: 'info'
  AGENT_SWARM_SIZE: '5'
```

### Secret

```yaml
# k8s/secret.yml
apiVersion: v1
kind: Secret
metadata:
  name: eremos-secret
  namespace: eremos
type: Opaque
data:
  DB_PASSWORD: <base64-encoded-password>
  API_KEY: <base64-encoded-api-key>
```

### Deployment

```yaml
# k8s/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: eremos-agent
  namespace: eremos
  labels:
    app: eremos
    component: agent
spec:
  replicas: 3
  selector:
    matchLabels:
      app: eremos
      component: agent
  template:
    metadata:
      labels:
        app: eremos
        component: agent
    spec:
      containers:
        - name: eremos
          image: eremos:latest
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              valueFrom:
                configMapKeyRef:
                  name: eremos-config
                  key: NODE_ENV
            - name: SOLANA_RPC_URL
              valueFrom:
                configMapKeyRef:
                  name: eremos-config
                  key: SOLANA_RPC_URL
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: eremos-secret
                  key: DB_PASSWORD
          resources:
            requests:
              memory: '256Mi'
              cpu: '250m'
            limits:
              memory: '512Mi'
              cpu: '500m'
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
```

### Service

```yaml
# k8s/service.yml
apiVersion: v1
kind: Service
metadata:
  name: eremos-service
  namespace: eremos
spec:
  selector:
    app: eremos
    component: agent
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP
```

### Ingress

```yaml
# k8s/ingress.yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: eremos-ingress
  namespace: eremos
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: eremos.yourdomain.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: eremos-service
                port:
                  number: 80
```

### Horizontal Pod Autoscaler

```yaml
# k8s/hpa.yml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: eremos-hpa
  namespace: eremos
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: eremos-agent
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

### Deploy to Kubernetes

```bash
# Create namespace
kubectl apply -f k8s/namespace.yml

# Apply configurations
kubectl apply -f k8s/configmap.yml
kubectl apply -f k8s/secret.yml

# Deploy application
kubectl apply -f k8s/deployment.yml
kubectl apply -f k8s/service.yml
kubectl apply -f k8s/ingress.yml
kubectl apply -f k8s/hpa.yml

# Check deployment
kubectl get pods -n eremos
kubectl logs -f deployment/eremos-agent -n eremos
```

## ☁️ Cloud Deployment

### AWS EKS

```bash
# Create EKS cluster
eksctl create cluster \
  --name eremos-cluster \
  --region us-west-2 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 1 \
  --nodes-max 4 \
  --managed

# Deploy to EKS
kubectl apply -f k8s/
```

### Google Cloud GKE

```bash
# Create GKE cluster
gcloud container clusters create eremos-cluster \
  --zone us-central1-a \
  --num-nodes 3 \
  --machine-type e2-medium

# Deploy to GKE
kubectl apply -f k8s/
```

### Azure AKS

```bash
# Create AKS cluster
az aks create \
  --resource-group eremos-rg \
  --name eremos-cluster \
  --node-count 3 \
  --node-vm-size Standard_DS2_v2

# Deploy to AKS
kubectl apply -f k8s/
```

## ✅ Production Checklist

### Security

- [ ] Use HTTPS for all external communication
- [ ] Implement proper authentication and authorization
- [ ] Use secrets management for sensitive data
- [ ] Enable rate limiting and DDoS protection
- [ ] Regular security updates and patches

### Monitoring

- [ ] Set up comprehensive logging
- [ ] Configure metrics collection (Prometheus)
- [ ] Set up alerting (Grafana, AlertManager)
- [ ] Monitor resource usage and performance
- [ ] Set up health checks and readiness probes

### Backup & Recovery

- [ ] Regular database backups
- [ ] Configuration backup and version control
- [ ] Disaster recovery plan
- [ ] Data retention policies

### Performance

- [ ] Load testing and capacity planning
- [ ] Optimize resource allocation
- [ ] Implement caching strategies
- [ ] Monitor and optimize database queries

### Compliance

- [ ] Data privacy compliance (GDPR, CCPA)
- [ ] Audit logging and trail
- [ ] Regular compliance reviews
- [ ] Documentation and procedures

## 📊 Monitoring & Maintenance

### Health Checks

```typescript
// health/health-check.ts
export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  checks: {
    database: boolean;
    redis: boolean;
    solana: boolean;
    agents: boolean;
  };
  timestamp: string;
  version: string;
}

export async function performHealthCheck(): Promise<HealthStatus> {
  // Implementation
}
```

### Metrics Collection

```typescript
// metrics/metrics.ts
export interface Metrics {
  eventsProcessed: number;
  signalsEmitted: number;
  agentHealth: Record<string, boolean>;
  memoryUsage: number;
  cpuUsage: number;
  responseTime: number;
}
```

### Logging Strategy

```typescript
// logging/logger.ts
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  agent?: string;
  context?: Record<string, any>;
}
```

## 🔧 Troubleshooting

### Common Issues

#### Agent Not Starting

```bash
# Check logs
kubectl logs -f deployment/eremos-agent -n eremos

# Check configuration
kubectl describe configmap eremos-config -n eremos

# Verify secrets
kubectl describe secret eremos-secret -n eremos
```

#### High Memory Usage

```bash
# Check memory usage
kubectl top pods -n eremos

# Analyze memory dump
kubectl exec -it <pod-name> -- node --inspect=0.0.0.0:9229
```

#### Database Connection Issues

```bash
# Test database connection
kubectl exec -it <pod-name> -- npm run test:db

# Check database logs
kubectl logs -f deployment/postgres -n eremos
```

#### Performance Issues

```bash
# Monitor resource usage
kubectl top nodes
kubectl top pods -n eremos

# Check network connectivity
kubectl exec -it <pod-name> -- ping solana-rpc
```

### Debug Mode

```bash
# Enable debug mode
kubectl set env deployment/eremos-agent DEBUG_ENABLED=true -n eremos

# View debug logs
kubectl logs -f deployment/eremos-agent -n eremos | grep DEBUG
```

### Emergency Procedures

1. **Service Outage**

   ```bash
   # Scale down to prevent cascading failures
   kubectl scale deployment eremos-agent --replicas=1 -n eremos

   # Check and fix the issue
   kubectl describe pods -n eremos

   # Scale back up
   kubectl scale deployment eremos-agent --replicas=3 -n eremos
   ```

2. **Data Loss**

   ```bash
   # Restore from backup
   kubectl exec -it <postgres-pod> -- pg_restore -d eremos backup.sql

   # Verify data integrity
   kubectl exec -it <pod-name> -- npm run validate:data
   ```

3. **Security Breach**

   ```bash
   # Rotate secrets immediately
   kubectl delete secret eremos-secret -n eremos
   kubectl apply -f k8s/secret.yml

   # Restart pods to pick up new secrets
   kubectl rollout restart deployment eremos-agent -n eremos
   ```

---

**Deploy with confidence and monitor continuously.** 🚀

_For detailed configuration options, see the [Configuration Guide](configuration.md)._
