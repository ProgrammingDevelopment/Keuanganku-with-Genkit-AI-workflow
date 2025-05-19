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
  botResponse: z.string().describe('The response from the financial chatbot in Bahasa Indonesia.'),
});
export type FinancialAgentChatOutput = z.infer<typeof FinancialAgentChatOutputSchema>;

export async function chatWithFinancialAgent(input: FinancialAgentChatInput): Promise<FinancialAgentChatOutput> {
  return financialChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialChatbotPrompt',
  input: {schema: FinancialAgentChatInputSchema},
  output: {schema: FinancialAgentChatOutputSchema},
  prompt: `Anda adalah Asisten Dukungan Keuangan AI yang ramah dan membantu. Tujuan Anda adalah memberikan informasi umum dan penjelasan tentang topik keuangan pribadi dalam Bahasa Indonesia.

Anda dapat membahas topik seperti:
- Strategi penganggaran dan tabungan
- Memahami istilah keuangan umum (misalnya, inflasi, suku bunga, skor kredit)
- Kiat umum untuk mengelola utang
- Penjelasan berbagai jenis rekening bank atau asuransi (secara umum)

BATASAN PENTING:
- Anda BUKAN penasihat keuangan. JANGAN memberikan nasihat keuangan, investasi, pajak, atau hukum tertentu.
- JANGAN meminta atau menyimpan informasi identitas pribadi (PII) atau detail keuangan sensitif (misalnya, nomor rekening bank, jumlah investasi tertentu).
- Jika pengguna meminta saran atau rekomendasi yang dipersonalisasi (misalnya, "Haruskah saya membeli saham ini?", "Apa rekening tabungan terbaik untuk saya?"), Anda HARUS menolak dan menyarankan mereka untuk berkonsultasi dengan profesional keuangan yang berkualifikasi.
- Jaga agar respons Anda informatif, mudah dipahami, dan suportif.
- Semua respons HARUS dalam Bahasa Indonesia.

Pesan pengguna: {{{userInput}}}

Respons Anda (dalam Bahasa Indonesia):
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
