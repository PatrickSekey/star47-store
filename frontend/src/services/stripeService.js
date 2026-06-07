const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const stripeService = {
  // Create a checkout session
  async createCheckoutSession(items, customerEmail, shippingFee, customerInfo) {
    try {
      console.log('Sending to backend:', { items, customerEmail, shippingFee, customerInfo });
      
      const response = await fetch(`${API_URL}/checkout/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customerEmail,
          shippingFee,
          customerInfo,  // ADDED: customer information for the order
        }),
      });
      
      const data = await response.json();
      console.log('Response from backend:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }
      
      return data;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  },
  
  // Calculate shipping fee
  async calculateShippingFee(state, quantity) {
    try {
      console.log('Calculating shipping for:', { state, quantity });
      
      const response = await fetch(`${API_URL}/shipping/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state,
          quantity,
        }),
      });
      
      const data = await response.json();
      console.log('Shipping calculation result:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate shipping');
      }
      
      return data;
    } catch (error) {
      console.error('Error calculating shipping:', error);
      throw error;
    }
  },
  
  // Get session details
  async getSessionDetails(sessionId) {
    try {
      const response = await fetch(`${API_URL}/checkout/session/${sessionId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get session details');
      }
      
      return data;
    } catch (error) {
      console.error('Error getting session details:', error);
      throw error;
    }
  }
};