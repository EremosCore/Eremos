# Analytics System

The Eremos Analytics System provides real-time performance monitoring and visualization for agent activity.

## Features

- **Real-time Tracking** - Automatically captures all agent signals
- **Performance Metrics** - Confidence scores, signal frequency, activity patterns
- **Visual Dashboard** - Clean web interface with live updates
- **Agent Comparison** - Compare performance across different agents

## Quick Start

```bash
# Start analytics dashboard
npm run dashboard

# Visit http://localhost:3001
```

## Development & Testing

```bash
# Generate sample data for testing
npm run analytics:populate

# Generate basic sample data
npm run analytics:demo

# Clear analytics data
npm run analytics:clear
```

## Dashboard Sections

### Overview
- Total signals across all agents
- Active agent count
- Average confidence score
- Daily signal activity

### Agent Performance
- Individual agent metrics
- Signal counts and confidence
- Activity timestamps

### Signal Distribution
- Signal types breakdown
- Visual frequency charts

### Recent Activity
- Live signal feed
- Latest detections with confidence scores

## Data Storage

Analytics data is stored in `data/analytics.json` and automatically managed by the system.

## Commands

```bash
npm run dashboard           # Start analytics dashboard
npm run analytics:demo      # Generate basic sample data
npm run analytics:populate  # Generate diverse realistic data
npm run analytics:clear     # Clear analytics data
```
