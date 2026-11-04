'use strict';

const balance = require('../js/balance.generated.js');
require('../js/data.js');

// Test scenarios share the same rule schema and opening defaults as the game.
function fixture(overrides) {
  return {
    ...overrides,
    rules: structuredClone(balance.rules),
    initial: {
      ...structuredClone(globalThis.SW_DATA.initial),
      inventory: {},
      costBasis: {},
      unlockedMechanics: ['trade'],
      ...overrides.initial
    }
  };
}

module.exports = { fixture };
