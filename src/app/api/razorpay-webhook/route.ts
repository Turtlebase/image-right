
import { type NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// This is your webhook secret, which you should set in your environment variables.
// It's used to verify that the webhook request is genuinely from Razorpay.
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  console.log('Razorpay webhook received.');

  if (!WEBHOOK_SECRET) {
    console.error('RAZORPAY_WEBHOOK_SECRET is not set. Cannot verify webhook.');
    // In a production environment, you must have a secret for security.
    return NextResponse.json({ status: 'error', message: 'Webhook secret not configured' }, { status: 500 });
  }
  
  const text = await req.text();
  const signature = req.headers.get('x-razorpay-signature');

  if (!signature) {
    console.warn('Webhook signature missing from header.');
    return NextResponse.json({ status: 'error', message: 'Invalid signature' }, { status: 403 });
  }

  try {
    const expectedSignature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(text)
        .digest('hex');

    if (expectedSignature !== signature) {
        console.warn('Webhook signature verification failed.');
        return NextResponse.json({ status: 'error', message: 'Invalid signature' }, { status: 403 });
    }
    console.log('Webhook signature verified successfully.');

  } catch (error) {
     console.error('Error during webhook signature verification:', error);
     return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }


  try {
    const event = JSON.parse(text);

    // This is where you would handle the event.
    // For example, if the event is 'subscription.activated', you would update your database.
    console.log('Webhook Event:', event.event);
    console.log('Webhook Payload:', event.payload);

    if (event.event === 'subscription.activated') {
      const subscriptionEntity = event.payload.subscription.entity;
      const userTelegramId = subscriptionEntity.notes?.telegram_user_id;

      if (userTelegramId) {
        console.log(`Subscription activated for Telegram user: ${userTelegramId}`);
        //
        // --- YOUR DATABASE LOGIC GOES HERE ---
        // 1. Find the user in your database using userTelegramId.
        // 2. Mark their 'plan' as 'Premium'.
        // 3. Save their 'subscriptionId' from Razorpay.
        // 4. Set a 'premiumUntil' date.
        //
      } else {
        console.warn('No telegram_user_id found in subscription notes.');
      }
    }

    // Acknowledge receipt of the webhook
    return NextResponse.json({ status: 'success' }, { status: 200 });

  } catch (error) {
    console.error('Could not parse webhook body:', error);
    return NextResponse.json({ status: 'error', message: 'Invalid JSON' }, { status: 400 });
  }
}
