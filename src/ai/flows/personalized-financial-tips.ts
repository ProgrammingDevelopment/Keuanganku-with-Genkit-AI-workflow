// src/ai/flows/personalized-financial-tips.ts
'use server';
/**
 * @fileOverview Provides personalized financial tips and insights based on user's income and expense data.
 *
 * - getPersonalizedFinancialTips - A function that processes user financial data and returns tailored advice.
 * - FinancialDataInput - The input type for the getPersonalizedFinancialTips function, representing user's financial records.
 * - FinancialTipsOutput - The return type for the getPersonalizedFinancialTips function, containing personalized financial advice.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialDataInputSchema = z.object({
  incomeEntries: z.array(
    z.object({
      date: z.string().describe('Date of income entry'),
      amount: z.number().describe('Amount of income'),
      notes: z.string().describe('Description of income source'),
    })
  ).describe('Array of income entries with date, amount, and notes.'),
  expenseEntries: z.array(
    z.object({
      date: z.string().describe('Date of expense entry'),
      amount: z.number().describe('Amount of expense'),
      notes: z.string().describe('Description of expense'),
    })
  ).describe('Array of expense entries with date, amount, and notes.'),
  userQuestion: z.string().optional().describe('Optional question from the user regarding the financial analysis.'),
});
export type FinancialDataInput = z.infer<typeof FinancialDataInputSchema>;

const FinancialTipsOutputSchema = z.object({
  summary: z.string().describe('A summary of the user financial situation.'),
  potentialIssues: z.array(z.string()).describe('List of potential financial issues identified.'),
  advice: z.array(z.string()).describe('Actionable financial advice tailored to the user.'),
  answer: z.string().optional().describe('Answer to the user question, if any.'),
});
export type FinancialTipsOutput = z.infer<typeof FinancialTipsOutputSchema>;

export async function getPersonalizedFinancialTips(input: FinancialDataInput): Promise<FinancialTipsOutput> {
  return personalizedFinancialTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedFinancialTipsPrompt',
  input: {schema: FinancialDataInputSchema},
  output: {schema: FinancialTipsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's income and expense data to identify potential financial issues and provide actionable advice.

Income Entries:
{{#each incomeEntries}}
- Date: {{date}}, Amount: {{amount}}, Notes: {{notes}}
{{/each}}

Expense Entries:
{{#each expenseEntries}}
- Date: {{date}}, Amount: {{amount}}, Notes: {{notes}}
{{/each}}

{% raw %}{{#if userQuestion}}User Question: {{{userQuestion}}}{{/if}}{% endraw %}

Based on this data, provide a summary of the user's financial situation, identify potential issues, and suggest actionable advice. If the user has a question, answer it based on your analysis.

Ensure the output is well-structured and easy to understand.

Summary:
{{summary}}

Potential Issues:
{{#each potentialIssues}}
- {{this}}
{{/each}}

Advice:
{{#each advice}}
- {{this}}
{{/each}}

{% raw %}{{#if answer}}Answer: {{{answer}}}{{/if}}{% endraw %}
`,
});

const personalizedFinancialTipsFlow = ai.defineFlow(
  {
    name: 'personalizedFinancialTipsFlow',
    inputSchema: FinancialDataInputSchema,
    outputSchema: FinancialTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
