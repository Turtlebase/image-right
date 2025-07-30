
import { NextRequest, NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_PAYMENT_BOT_TOKEN;
const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

if (!token) {
  throw new Error('TELEGRAM_PAYMENT_BOT_TOKEN is not defined in environment variables.');
}

// Bot instance is created outside the handler to persist across requests
const bot = new TelegramBot(token);

// Listener for the pre_checkout_query event
bot.on('pre_checkout_query', (preCheckoutQuery) => {
  console.log('Received pre_checkout_query:', preCheckoutQuery);
  // This is the crucial step: you must answer the query.
  bot.answerPreCheckoutQuery(preCheckoutQuery.id, true)
    .then(() => {
        console.log(`Answered pre_checkout_query for ${preCheckoutQuery.id} successfully.`);
    })
    .catch((error) => {
        console.error(`Failed to answer pre_checkout_query for ${preCheckoutQuery.id}:`, error);
        // Even if there's an error, try to answer negatively so Telegram doesn't hang
        bot.answerPreCheckoutQuery(preCheckoutQuery.id, false, {
            error_message: "Sorry, we could not process your payment at this time. Please try again later."
        });
    });
});

// Listener for successful payments (optional, but good for logging/analytics)
bot.on('successful_payment', (msg) => {
    console.log('Successful payment received:', msg);
    // Here you could, for example, save the user's premium status to a database
});


export async function POST(req: NextRequest) {
  // 1. Security Check: Verify the secret token
  const secret = req.headers.get('X-Telegram-Bot-Api-Secret-Token');
  if (secret !== webhookSecret) {
    console.warn('Unauthorized webhook access attempt. Secret mismatch.');
    return NextResponse.json({ status: 'unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // 2. Process the update using the library
    // This will trigger the event listeners above (e.g., 'pre_checkout_query')
    bot.processUpdate(body);
    
    // 3. Immediately respond to Telegram to acknowledge receipt
    return NextResponse.json({ status: 'ok' });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ status: 'error', message: 'Internal server error' }, { status: 500 });
  }
}
