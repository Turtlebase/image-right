
import { NextRequest, NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_PAYMENT_BOT_TOKEN;
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

if (!token) {
  console.error('FATAL_ERROR: TELEGRAM_PAYMENT_BOT_TOKEN is not set in environment variables.');
}
if (!secret) {
  console.warn('WARNING: TELEGRAM_WEBHOOK_SECRET is not set. Your webhook is not secure.');
}

let bot: TelegramBot | null = null;

if (token) {
  bot = new TelegramBot(token);

  // Listener for Pre-Checkout Queries. This is the crucial step.
  // Telegram sends this query to your bot when a user clicks the pay button.
  // You must answer it within 10 seconds.
  bot.on('pre_checkout_query', (query) => {
    console.log(`Received pre_checkout_query from user ${query.from.id} for ${query.total_amount} ${query.currency}`);
    // Answer the query to confirm that you are ready to process the payment.
    bot.answerPreCheckoutQuery(query.id, true).catch((error) => {
        console.error('Failed to answer pre_checkout_query:', error);
    });
  });

  // Listener for successful payments.
  bot.on('successful_payment', (msg) => {
    console.log('Received successful_payment:', msg.successful_payment);
    const userId = msg.from?.id;
    const payload = msg.successful_payment.invoice_payload;
    console.log(`Payment successful for user ${userId}. Payload: ${payload}`);
    // Here you would typically grant the user premium access in your database.
  });

} else {
    console.error("Bot could not be initialized. TELEGRAM_PAYMENT_BOT_TOKEN is missing.");
}


export async function POST(req: NextRequest) {
  // 1. Verify the secret token
  const secretTokenHeader = req.headers.get('X-Telegram-Bot-Api-Secret-Token');
  if (secret && secretTokenHeader !== secret) {
    console.warn('Webhook received request with invalid secret token.');
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (!bot) {
    console.error('Webhook POST failed: Bot not initialized.');
    return NextResponse.json({ status: 'error', message: 'Bot not initialized on server.' }, { status: 500 });
  }
  
  try {
    const body = await req.json();

    // 2. Process the update using the library
    // This will trigger the .on('pre_checkout_query', ...) and .on('successful_payment', ...) listeners above.
    bot.processUpdate(body);

    // 3. Respond to Telegram immediately
    // Telegram doesn't care what we send back here, only that it gets a 200 OK response to know we've received the update.
    return NextResponse.json({ status: 'ok' });

  } catch (error) {
    console.error('Error processing Telegram webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
  }
}
