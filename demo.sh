#!/bin/bash

# Eremos Interactive Demo Script
# Showcases playground and testing tools

set -e

echo "🤖 Welcome to the Eremos Interactive Demo!"
echo "========================================"
echo ""

# Colors for better output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎮 Starting Interactive Playground...${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "playground/index.html" ]; then
    echo "❌ Playground not found. Please run this script from the Eremos root directory."
    exit 1
fi

# Start a simple HTTP server for the playground
if command -v python3 &> /dev/null; then
    echo -e "${GREEN}✅ Starting playground on http://localhost:8000${NC}"
    echo "Opening playground in your default browser..."
    
    # Start server in background
    cd playground
    python3 -m http.server 8000 > /dev/null 2>&1 &
    SERVER_PID=$!
    cd ..
    
    # Wait a moment for server to start
    sleep 2
    
    # Try to open browser (works on most systems)
    if command -v open &> /dev/null; then
        open http://localhost:8000  # macOS
    elif command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:8000  # Linux
    elif command -v start &> /dev/null; then
        start http://localhost:8000  # Windows
    else
        echo "Please open http://localhost:8000 in your browser"
    fi
    
    echo ""
    echo -e "${YELLOW}🔥 Playground Features:${NC}"
    echo "• Click agents to trigger events"
    echo "• Watch real-time signal flows"
    echo "• Monitor confidence scores"
    echo "• View performance metrics"
    echo "• Control simulation parameters"
    echo ""
    
    # Wait for user input
    echo -e "${BLUE}Press ENTER to continue to the Agent Testing demo...${NC}"
    read
    
    # Kill the server
    kill $SERVER_PID 2>/dev/null || true
    
else
    echo "❌ Python3 not found. Please install Python3 to run the playground demo."
    echo "Or manually open playground/index.html in your browser."
fi

echo ""
echo -e "${BLUE}🧪 Running Agent Testing Suite...${NC}"
echo ""

# Check if TypeScript is available
if command -v npx &> /dev/null && command -v ts-node &> /dev/null; then
    echo -e "${GREEN}✅ Running comprehensive agent tests...${NC}"
    echo ""
    
    # Run the agent tester
    npx ts-node tools/agent-tester.ts 2>/dev/null || echo "⚠️  Some tests may require proper agent setup"
    
    echo ""
    echo -e "${YELLOW}🎯 Testing Features Demonstrated:${NC}"
    echo "• Performance profiling & benchmarks"
    echo "• Memory usage analysis"
    echo "• Confidence score validation"
    echo "• Error resilience testing"
    echo "• Concurrent processing capabilities"
    echo "• Automated report generation"
    
else
    echo "⚠️  TypeScript/ts-node not available. Showing mock test output:"
    echo ""
    echo "🤖 Eremos Agent Testing Suite"
    echo "================================"
    echo ""
    echo "📁 Discovered 5 agent(s): example, harvester, launchtracker, observer, theron"
    echo ""
    echo "🔍 Testing Agent: theron"
    echo "📄 File: ./agents/theron.ts"
    echo "  ✅ basic-initialization  | 12.50ms | 0.15MB | Signals: 1"
    echo "  ✅ signal-emission       | 8.32ms  | 0.08MB | Signals: 3"
    echo "  ✅ confidence-calculation| 5.21ms  | 0.05MB | Signals: 1"
    echo "  ✅ error-handling        | 15.43ms | 0.12MB | Signals: 3"
    echo "  ✅ memory-efficiency     | 45.67ms | 2.34MB | Signals: 10"
    echo "  ✅ concurrent-processing | 23.89ms | 0.45MB | Signals: 10"
    echo "✅ Completed testing theron"
    echo ""
    echo "📊 TEST RESULTS SUMMARY"
    echo "========================"
    echo ""
    echo "⏱️  Total execution time: 2847ms"
    echo "📈 Overall success rate: 96.7% (29/30)"
    echo "🤖 Agents tested: 5"
    echo ""
    echo "🤖 THERON"
    echo "   Reliability: 100.0% (6/6)"
    echo "   Avg Execution: 18.51ms"
    echo "   Avg Memory: 0.53MB"
    echo "   Avg Confidence: 0.847"
    echo "   Total Signals: 28"
    echo ""
    echo "🎯 RECOMMENDATIONS"
    echo "=================="
    echo "💡 All agents are performing well! Consider adding more test cases."
    echo ""
    echo "✨ Testing completed! Check ./test-results.json for detailed metrics."
fi

echo ""
echo -e "${GREEN}🎉 Demo Complete!${NC}"
echo ""
echo -e "${YELLOW}What you've experienced:${NC}"
echo "• Interactive agent visualization playground"
echo "• Real-time signal monitoring and simulation"  
echo "• Comprehensive agent testing and profiling"
echo "• Performance metrics and analytics"
echo "• Professional developer tooling"
echo ""
echo -e "${BLUE}🚀 Ready to explore Eremos agent development!${NC}"
echo "Check out the agents/ directory to see example implementations."
echo ""