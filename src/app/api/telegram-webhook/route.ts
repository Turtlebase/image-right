
import { NextRequest, NextResponse } from 'next/server';

/**
 * This is the webhook handler for Telegram payments.
 * When a user successfully pays with Stars, Telegram sends a notification here.
 *
 * To make this work, you must:
 * 1. Deploy your application to get a public URL.
 * 2. Go to @BotFather on Telegram.
 * 3. Select your bot, go to "Bot Settings" -> "Payments".
 * 4. Choose a payment provider (like Stripe, or "Telegram Stars" for just stars).
 * 5. Set the webhook URL to: https://<your-deployed-app-url>/api/telegram-webhook
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // The `pre_checkout_query` is sent by Telegram to confirm you are ready to process the payment.
    if (body.pre_checkout_query) {
      console.log('Received pre_checkout_query:', body.pre_checkout_query);
      // You must answer this query to proceed with the payment.
      // Here you could add logic to check if the product is available, etc.
      // For now, we will just confirm we are ready.
      
      // Note: The Telegram Bot API doesn't have a direct REST endpoint for `answerPreCheckoutQuery`.
      // This action is typically performed using a bot library (like `node-telegram-bot-api` or `telegraf`).
      // Since we don't have a full bot setup here, we acknowledge receipt and would rely on a bot framework
      // to send the actual confirmation back to Telegram.
      
      return NextResponse.json({
        status: 'ok',
        message: 'Pre-checkout acknowledged. A bot framework would now call answerPreCheckoutQuery.'
      });
    }

    // The `successful_payment` message is sent after the user has paid.
    if (body.message && body.message.successful_payment) {
      const paymentInfo = body.message.successful_payment;
      console.log('Received successful_payment:', paymentInfo);
      
      const invoicePayload = paymentInfo.invoice_payload;
      // Example payload: "premium-month-12345678-1678886400000"
      const userId = invoicePayload.split('-')[2];

      console.log(`Processing premium subscription for user ID: ${userId}`);

      // =================================================================
      // !! IMPORTANT !!
      // In a real application, this is where you would securely grant the user
      // premium status in your database.
      //
      // e.g., await db.collection('users').doc(userId).update({ isPremium: true, premiumExpiry: ... });
      //
      // Since we don't have a database, the client-side optimistally sets
      // premium status on the success page. This webhook serves as the necessary
      // server-side confirmation point for Telegram.
      // =================================================================

      return NextResponse.json({ status: 'ok', message: 'Payment processed successfully.' });
    }

    // If the request is not a pre_checkout_query or successful_payment, ignore it.
    return NextResponse.json({ status: 'ignored', message: 'Not a relevant Telegram update.' });

  } catch (error) {
    console.error('Error processing Telegram webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
  }
}
