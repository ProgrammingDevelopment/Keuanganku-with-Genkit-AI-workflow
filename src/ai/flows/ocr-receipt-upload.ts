// 'use server'
'use server';

/**
 * @fileOverview Extracts information from uploaded receipts using OCR.
 *
 * - ocrReceipt - A function that handles the receipt OCR process.
 * - OcrReceiptInput - The input type for the ocrReceipt function.
 * - OcrReceiptOutput - The return type for the ocrReceipt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OcrReceiptInputSchema = z.object({
  receiptDataUri: z
    .string()
    .describe(
      "The receipt image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type OcrReceiptInput = z.infer<typeof OcrReceiptInputSchema>;

const OcrReceiptOutputSchema = z.object({
  date: z.string().describe('The date on the receipt (YYYY-MM-DD).'),
  amount: z.number().describe('The total amount on the receipt.'),
  category: z.string().describe('The expense category of the receipt.'),
  merchant: z.string().describe('The name of the merchant on the receipt.'),
});
export type OcrReceiptOutput = z.infer<typeof OcrReceiptOutputSchema>;

export async function ocrReceipt(input: OcrReceiptInput): Promise<OcrReceiptOutput> {
  return ocrReceiptFlow(input);
}

const ocrReceiptPrompt = ai.definePrompt({
  name: 'ocrReceiptPrompt',
  input: {schema: OcrReceiptInputSchema},
  output: {schema: OcrReceiptOutputSchema},
  prompt: `You are an expert in extracting data from receipts.  Given a receipt image, extract the date, amount, category, and merchant.

  Return the data in JSON format.

  Receipt Image: {{media url=receiptDataUri}}
  `,
});

const ocrReceiptFlow = ai.defineFlow(
  {
    name: 'ocrReceiptFlow',
    inputSchema: OcrReceiptInputSchema,
    outputSchema: OcrReceiptOutputSchema,
  },
  async input => {
    const {output} = await ocrReceiptPrompt(input);
    return output!;
  }
);
