'use server';
/**
 * @fileOverview A Genkit flow to create a Razorpay subscription link.
 * 
 * - createPaymentLink - A function that creates a Razorpay subscription link.
 * - CreatePaymentLinkInput - The input type for the function.
 * - CreatePaymentLinkOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import Razorpay from 'razorpay';

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn(
    'RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set. Please set it in your .env file to use payment features.'
  );
}

const CreatePaymentLinkInputSchema = z.object({
  planId: z.string().describe("The ID of the Razorpay subscription plan."),
  telegramUserId: z.string().describe("The Telegram user ID for tracking."),
  telegramUsername: z.string().describe("The Telegram username."),
});
export type CreatePaymentLinkInput = z.infer<typeof CreatePaymentLinkInputSchema>;

const CreatePaymentLinkOutputSchema = z.object({
  short_url: z.string().describe("The short URL for the subscription link."),
});
export type CreatePaymentLinkOutput = z.infer<typeof CreatePaymentLinkOutputSchema>;

export async function createPaymentLink(input: CreatePaymentLinkInput): Promise<CreatePaymentLinkOutput> {
  return createPaymentLinkFlow(input);
}

export const createPaymentLinkFlow = ai.flow(
  {
    name: 'createPaymentLinkFlow',
    inputSchema: CreatePaymentLinkInputSchema,
    outputSchema: CreatePaymentLinkOutputSchema,
  },
  async (input) => {
    const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
      
    try {
      const result = await instance.subscriptionLink.create({
        plan_id: input.planId,
        total_count: 12, // For a 1-year subscription with monthly billing
        quantity: 1,
        notes: {
          telegram_user_id: input.telegramUserId,
          username: input.telegramUsername,
        },
        notify_info: {
            notify_phone: false,
            notify_email: false,
        }
      });
      return { short_url: result.short_url };
    } catch (error) {
        console.error("Razorpay API Error:", error);
        throw new Error("Failed to create Razorpay subscription link.");
    }
  }
);
