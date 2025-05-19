// 'use server';

/**
 * @fileOverview This file defines a Genkit flow for answering user questions about financial tips and conclusions.
 *
 * - askFinancialQuestion - A function that takes a question and context as input and returns an answer.
 * - AskFinancialQuestionInput - The input type for the askFinancialQuestion function.
 * - AskFinancialQuestionOutput - The return type for the askFinancialQuestion function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskFinancialQuestionInputSchema = z.object({
  question: z.string().describe('The question the user is asking.'),
  financialTips: z.string().describe('The financial tips and conclusions to provide context for the question.'),
});

export type AskFinancialQuestionInput = z.infer<typeof AskFinancialQuestionInputSchema>;

const AskFinancialQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question, based on the provided financial tips and conclusions.'),
});

export type AskFinancialQuestionOutput = z.infer<typeof AskFinancialQuestionOutputSchema>;

export async function askFinancialQuestion(input: AskFinancialQuestionInput): Promise<AskFinancialQuestionOutput> {
  return askFinancialQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askFinancialQuestionPrompt',
  input: {schema: AskFinancialQuestionInputSchema},
  output: {schema: AskFinancialQuestionOutputSchema},
  prompt: `You are a financial advisor. A user has received the following financial tips and conclusions:

  {{financialTips}}

The user is asking the following question about these tips:

  {{question}}

Answer the user's question clearly and concisely, using the information provided in the financial tips and conclusions as context. Do not provide any financial advice beyond the scope of the provided tips and conclusions.`,
});

const askFinancialQuestionFlow = ai.defineFlow(
  {
    name: 'askFinancialQuestionFlow',
    inputSchema: AskFinancialQuestionInputSchema,
    outputSchema: AskFinancialQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
