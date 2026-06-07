// Shipping rules: [state][quantity] = fee in USD
const shippingRules = {
  // New York
  'NY': {
    1: 5.00,
    2: 7.00,
    3: 9.00,
    4: 11.00,
    5: 13.00
  },
  // California
  'CA': {
    1: 7.00,
    2: 10.00,
    3: 13.00,
    4: 16.00,
    5: 19.00
  },
  // Texas
  'TX': {
    1: 6.00,
    2: 8.50,
    3: 11.00,
    4: 13.50,
    5: 16.00
  },
  // Florida
  'FL': {
    1: 5.50,
    2: 8.00,
    3: 10.50,
    4: 13.00,
    5: 15.50
  },
  // Illinois
  'IL': {
    1: 6.50,
    2: 9.00,
    3: 11.50,
    4: 14.00,
    5: 16.50
  },
  // Default for other states
  'DEFAULT': {
    1: 8.00,
    2: 12.00,
    3: 16.00,
    4: 20.00,
    5: 24.00
  }
};

// Maximum quantity to calculate for
const MAX_QUANTITY = 5;

// Function to calculate shipping fee
function calculateShippingFee(state, quantity) {
  // Ensure quantity doesn't exceed max
  const actualQuantity = Math.min(quantity, MAX_QUANTITY);
  
  // Get rules for this state, or use DEFAULT
  const stateRules = shippingRules[state] || shippingRules.DEFAULT;
  
  // Get fee for this quantity, or use highest tier if quantity exceeds max
  let fee = stateRules[actualQuantity];
  
  if (!fee && actualQuantity > MAX_QUANTITY) {
    // For quantities beyond MAX_QUANTITY, use the MAX_QUANTITY fee
    fee = stateRules[MAX_QUANTITY];
    // Add $2 for each additional item beyond MAX_QUANTITY
    const extraItems = actualQuantity - MAX_QUANTITY;
    fee += extraItems * 2;
  } else if (!fee) {
    // Fallback to default fee
    fee = 10.00;
  }
  
  return parseFloat(fee.toFixed(2));
}

// Add custom rules (you can expand this)
function addCustomRule(state, quantity, fee) {
  if (!shippingRules[state]) {
    shippingRules[state] = {};
  }
  shippingRules[state][quantity] = fee;
}

// Get available states
function getAvailableStates() {
  const states = Object.keys(shippingRules).filter(key => key !== 'DEFAULT');
  return states;
}

module.exports = {
  calculateShippingFee,
  addCustomRule,
  getAvailableStates,
  shippingRules,
  MAX_QUANTITY
};