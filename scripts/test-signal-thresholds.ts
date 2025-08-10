type SignalSimulation = {
  agent: string
  threshold: number
  currentConfidence: number
  willEmit: boolean
}

const thresholds = [0.5, 0.6, 0.72, 0.85, 0.91]

thresholds.forEach((confidence) => {
  const result: SignalSimulation = {
    agent: 'Theron',
    threshold: 0.7,
    currentConfidence: confidence,
    willEmit: confidence > 0.7,
  }

  console.log(`\n[Signal Test]`)
  console.log(`Confidence: ${result.currentConfidence}`)
  console.log(`Threshold: ${result.threshold}`)
  console.log(`Emitted: ${result.willEmit ? 'YES' : 'NO'}`)
})
