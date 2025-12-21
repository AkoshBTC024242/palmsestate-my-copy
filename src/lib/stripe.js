// Production Stripe configuration
import { loadStripe } from '@stripe/stripe-js';

// YOUR LIVE PUBLISHABLE KEY - Put this directly in code for now
const stripePublishableKey = 'pk_live_51ScdoJQoxcQwXGCcSWJx7k7VGfZfzdlJ2zmT78QiNfWMmB4xa5V6jgZykhqvPFPX7cZ0hnZWOHGlc7I2BEftOH0d00f5e9O9r6';

// Initialize Stripe
export const stripePromise = loadStripe(stripePublishableKey);

// API endpoint for your Supabase Edge Function
export const API_BASE_URL = 'https://hnruxtddkfxsoulskbyr.supabase.co/functions/v1';

// Create payment intent via backend
export const createPaymentIntent = async (amount, applicationId, customerEmail) => {
  try {
    const response = await fetch(`${API_BASE_URL}/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        amount,
        applicationId,
        customerEmail
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create payment');
    }

    return {
      success: true,
      ...data
    };
    
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get public configuration
export const getStripeConfig = () => {
  return {
    publishableKey: stripePublishableKey,
    isLiveMode: true,
    currency: 'usd',
    applicationFee: 5000, // $50 in cents
    apiBaseUrl: API_BASE_URL
  };
};

// Check if everything is configured
export const checkPaymentConfig = () => {
  const config = getStripeConfig();
  
  if (!config.publishableKey.startsWith('pk_live_')) {
    return {
      ready: false,
      message: '❌ Not using live Stripe key',
      warning: 'Using test mode in production'
    };
  }

  if (!config.apiBaseUrl.includes('supabase.co')) {
    return {
      ready: false,
      message: '❌ API URL not configured',
      warning: 'Backend API not set up'
    };
  }

  return {
    ready: true,
    message: '✅ Payment system ready for live transactions',
    warning: '⚠️ LIVE MODE: Real money will be charged'
  };
};
