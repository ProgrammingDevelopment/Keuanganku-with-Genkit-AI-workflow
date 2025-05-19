'use server';
/**
 * @fileOverview A Genkit flow for a financial support chatbot.
 *
 * - chatWithFinancialAgent - A function that takes user input and returns a response from the financial agent.
 * - FinancialAgentChatInput - The input type for the chatWithFinancialAgent function.
 * - FinancialAgentChatOutput - The return type for the chatWithFinancialAgent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialAgentChatInputSchema = z.object({
  userInput: z.string().describe('The message from the user to the financial chatbot.'),
});
export type FinancialAgentChatInput = z.infer<typeof FinancialAgentChatInputSchema>;

const FinancialAgentChatOutputSchema = z.object({
  botResponse: z.string().describe('The response from the financial chatbot.'),
});
export type FinancialAgentChatOutput = z.infer<typeof FinancialAgentChatOutputSchema>;

export async function chatWithFinancialAgent(input: FinancialAgentChatInput): Promise<FinancialAgentChatOutput> {
  return financialChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialChatbotPrompt',
  input: {schema: FinancialAgentChatInputSchema},
  output: {schema: FinancialAgentChatOutputSchema},
  prompt: `You are a friendly and helpful AI Financial Support Assistant. Your goal is to provide general information and explanations about personal finance topics.

You can discuss topics like:
- Budgeting and saving strategies
- Understanding common financial terms (e.g., inflation, interest rates, credit scores)
- General tips for managing debt
- Explanations of different types of bank accounts or insurance (in general terms)

IMPORTANT LIMITATIONS:
- You are NOT a financial advisor. Do NOT provide specific financial, investment, tax, or legal advice.
- Do NOT ask for or store any personal identifiable information (PII) or sensitive financial details (e.g., bank account numbers, specific investment amounts).
- If a user asks for personalized advice or recommendations (e.g., "Should I buy this stock?", "What's the best savings account for me?"), you MUST decline and suggest they consult a qualified financial professional.
- Keep your responses informative, easy to understand, and supportive.

User's message: {{{userInput}}}

Your response:
`,
});

const financialChatbotFlow = ai.defineFlow(
  {
    name: 'financialChatbotFlow',
    inputSchema: FinancialAgentChatInputSchema,
    outputSchema: FinancialAgentChatOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
