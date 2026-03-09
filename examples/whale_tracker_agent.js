// SPDX-License-Identifier: MIT
// Whale Tracker Agent Example
const { SwarmAgent } = require('eremos-core');

const agent = new SwarmAgent({
  name: 'WhaleTracker',
  adapters: ['solana'],
  onMessage: (msg) => {
    if (msg.type === 'transaction' && msg.data.amount > 100000) {
      console.log('Whale transaction:', msg.data);
    }
  },
});

agent.start();
