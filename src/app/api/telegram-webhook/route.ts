
import { NextRequest, NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';

// Use the payment bot token for the webhook
const token = process.env.TELEGRAM_PAYMENT_BOT_TOKEN;

if (!token) {
  console.error('FATAL_ERROR: TELEGRAM_PAYMENT_BOT_TOKEN is not set in environment variables.');
}

let bot: TelegramBot | null = null;
if (token) {
  bot = new TelegramBot(token);
}

export async function POST(req: NextRequest) {
  if (!bot) {
    return NextResponse.json({ status: 'error', message: 'Bot not initialized. TELEGRAM_PAYMENT_BOT_TOKEN is missing.' }, { status: 500 });
  }

  try {
    const body = await req.json();

    // 1. Handle Pre-Checkout Query (CRITICAL STEP)
    if (body.pre_checkout_query) {
      const preCheckoutQuery = body.pre_checkout_query;
      console.log('Received pre_checkout_query:', preCheckoutQuery.id);

      // Answer the pre-checkout query to confirm we are ready.
      // This is what allows the payment sheet to open for the user.
      await bot.answerPreCheckoutQuery(preCheckoutQuery.id, true);
      
      console.log('Successfully answered pre_checkout_query.');
      return NextResponse.json({ status: 'ok', message: 'Pre-checkout query answered.' });
    }

    // 2. Handle Successful Payment
    if (body.message && body.message.successful_payment) {
      const paymentInfo = body.message.successful_payment;
      console.log('Received successful_payment:', paymentInfo);
      
      const invoicePayload = paymentInfo.invoice_payload;
      const userId = invoicePayload.split('-')[2];

      console.log(`Processing premium subscription for user ID: ${userId}`);

      // In a real application, you would now grant premium status in your database.
      // e.g., await db.users.update({ where: { id: userId }, data: { isPremium: true } });

      return NextResponse.json({ status: 'ok', message: 'Payment processed successfully.' });
    }

    // If the request is not a type we handle, ignore it.
    console.log('Received a Telegram update that is not a pre_checkout_query or successful_payment.');
    return NextResponse.json({ status: 'ignored', message: 'Not a relevant Telegram update.' });

  } catch (error) {
    console.error('Error processing Telegram webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
  }
}
