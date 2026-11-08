import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_for_build';

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-24.acacia' as any,
  typescript: true,
});

export async function createStripePaymentIntent({
  amount, // in major units (e.g. 24.99)
  currency = 'gbp',
  metadata = {},
}: {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
}): Promise<{ clientSecret: string; id: string } | null> {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('STRIPE_SECRET_KEY is not set. Using mock intent for development.');
    return {
      clientSecret: `pi_mock_${Date.now()}_secret_mock`,
      id: `pi_mock_${Date.now()}`,
    };
  }

  const amountInSmallestUnit = Math.round(amount * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInSmallestUnit,
    currency: currency.toLowerCase(),
    automatic_payment_methods: {
      enabled: true,
    },
    metadata,
  });

  if (!paymentIntent.client_secret) {
    throw new Error('Failed to create payment intent client secret');
  }

  return {
    clientSecret: paymentIntent.client_secret,
    id: paymentIntent.id,
  };
}
