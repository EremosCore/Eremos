// SPDX-License-Identifier: MIT
// Simple MEV Monitor Agent Example
const { SwarmAgent } = require('eremos-core');

const agent = new SwarmAgent({
  name: 'MEVMonitor',
  adapters: ['solana'],
  onMessage: (msg) => {
    if (msg.type === 'transaction' && msg.data.isMEV) {
      console.log('MEV opportunity:', msg.data);
    }
  },
});

agent.start();
