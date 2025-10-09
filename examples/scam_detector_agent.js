// SPDX-License-Identifier: MIT
// Scam Detector Agent Example
const { SwarmAgent } = require('eremos-core');

const agent = new SwarmAgent({
  name: 'ScamDetector',
  adapters: ['solana'],
  onMessage: (msg) => {
    if (msg.type === 'transaction' && msg.data.suspicious) {
      console.log('Scam detected:', msg.data);
    }
  },
});

agent.start();
