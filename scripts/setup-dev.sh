#!/bin/bash

# Eremos Development Environment Setup Script
# This script sets up a complete development environment for Eremos

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js version
check_node_version() {
    log_info "Checking Node.js version..."
    
    if ! command_exists node; then
        log_error "Node.js is not installed. Please install Node.js 18 or later."
        log_info "Visit: https://nodejs.org/"
        exit 1
    fi
    
    local node_version
    node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    
    if [ "$node_version" -lt 18 ]; then
        log_error "Node.js version $node_version is not supported. Please install Node.js 18 or later."
        exit 1
    fi
    
    log_success "Node.js $(node --version) is installed"
}

# Check npm or yarn
check_package_manager() {
    log_info "Checking package manager..."
    
    if command_exists pnpm; then
        PACKAGE_MANAGER="pnpm"
        log_success "Using pnpm $(pnpm --version)"
    elif command_exists yarn; then
        PACKAGE_MANAGER="yarn"
        log_success "Using yarn $(yarn --version)"
    elif command_exists npm; then
        PACKAGE_MANAGER="npm"
        log_success "Using npm $(npm --version)"
    else
        log_error "No package manager found. Please install npm, yarn, or pnpm."
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    case $PACKAGE_MANAGER in
        "pnpm")
            pnpm install
            ;;
        "yarn")
            yarn install
            ;;
        "npm")
            npm install
            ;;
    esac
    
    log_success "Dependencies installed successfully"
}

# Setup environment file
setup_environment() {
    log_info "Setting up environment configuration..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            log_success "Created .env file from .env.example"
            log_warning "Please review and update the .env file with your configuration"
        else
            log_warning "No .env.example file found. Creating basic .env file..."
            cat > .env << EOF
# Eremos Development Configuration
NODE_ENV=development
LOG_LEVEL=debug
SOLANA_RPC_URL=https://api.devnet.solana.com
PORT=3000

# Database Configuration
DATABASE_URL=postgresql://localhost:5432/eremos_dev

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Monitoring Configuration
MONITORING_ENABLED=true
MONITORING_PORT=9090
EOF
            log_success "Created basic .env file"
        fi
    else
        log_info ".env file already exists, skipping..."
    fi
}

# Setup Git hooks
setup_git_hooks() {
    log_info "Setting up Git hooks..."
    
    if [ -d ".git" ]; then
        if command_exists husky; then
            npx husky install
            log_success "Husky Git hooks installed"
        else
            log_warning "Husky not found, skipping Git hooks setup"
        fi
    else
        log_warning "Not a Git repository, skipping Git hooks setup"
    fi
}

# Run initial build
run_initial_build() {
    log_info "Running initial build..."
    
    case $PACKAGE_MANAGER in
        "pnpm")
            pnpm run build
            ;;
        "yarn")
            yarn build
            ;;
        "npm")
            npm run build
            ;;
    esac
    
    log_success "Initial build completed successfully"
}

# Run tests
run_tests() {
    log_info "Running tests to verify setup..."
    
    case $PACKAGE_MANAGER in
        "pnpm")
            pnpm run test
            ;;
        "yarn")
            yarn test
            ;;
        "npm")
            npm test
            ;;
    esac
    
    log_success "All tests passed"
}

# Check for required services
check_services() {
    log_info "Checking for required services..."
    
    # Check for PostgreSQL
    if command_exists psql; then
        log_success "PostgreSQL is available"
    else
        log_warning "PostgreSQL not found. Install PostgreSQL for database functionality."
        log_info "Visit: https://www.postgresql.org/download/"
    fi
    
    # Check for Redis
    if command_exists redis-cli; then
        log_success "Redis is available"
    else
        log_warning "Redis not found. Install Redis for caching functionality."
        log_info "Visit: https://redis.io/download"
    fi
    
    # Check for Docker
    if command_exists docker; then
        log_success "Docker is available"
        if command_exists docker-compose; then
            log_success "Docker Compose is available"
        else
            log_warning "Docker Compose not found. Install for easy service orchestration."
        fi
    else
        log_warning "Docker not found. Install Docker for containerized development."
        log_info "Visit: https://docs.docker.com/get-docker/"
    fi
}

# Setup complete message
setup_complete() {
    log_success "\n🎉 Eremos development environment setup complete!"
    echo
    log_info "Next steps:"
    echo "  1. Review and update the .env file with your configuration"
    echo "  2. Start the development server: $PACKAGE_MANAGER run dev"
    echo "  3. Run tests: $PACKAGE_MANAGER run test"
    echo "  4. Build the project: $PACKAGE_MANAGER run build"
    echo
    log_info "For Docker development:"
    echo "  1. Start services: docker-compose up -d"
    echo "  2. View logs: docker-compose logs -f eremos"
    echo "  3. Stop services: docker-compose down"
    echo
    log_info "Documentation: https://github.com/EremosCore/Eremos/tree/main/docs"
    echo
}

# Main execution
main() {
    log_info "Starting Eremos development environment setup..."
    echo
    
    check_node_version
    check_package_manager
    install_dependencies
    setup_environment
    setup_git_hooks
    
    # Optional steps
    if [ "${1:-}" != "--skip-build" ]; then
        run_initial_build
    fi
    
    if [ "${1:-}" != "--skip-test" ] && [ "${2:-}" != "--skip-test" ]; then
        run_tests
    fi
    
    check_services
    setup_complete
}

# Parse command line arguments
case "${1:-}" in
    "--help" | "-h")
        echo "Eremos Development Environment Setup"
        echo
        echo "Usage: $0 [OPTIONS]"
        echo
        echo "Options:"
        echo "  --skip-build    Skip the initial build step"
        echo "  --skip-test     Skip running tests"
        echo "  --help, -h      Show this help message"
        echo
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac