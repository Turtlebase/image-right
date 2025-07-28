'use server';

export async function getSubscriptionConfig() {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const planId = process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID;

  if (!keyId || !planId) {
    console.error('Razorpay environment variables are not set on the server.');
    return { error: 'Server configuration error.' };
  }

  return { keyId, planId };
}
