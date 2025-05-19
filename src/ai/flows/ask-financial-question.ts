
'use server';

/**
 * @fileOverview Berkas ini mendefinisikan alur Genkit untuk menjawab pertanyaan pengguna tentang tips dan kesimpulan keuangan.
 *
 * - askFinancialQuestion - Fungsi yang menerima pertanyaan dan konteks sebagai input dan mengembalikan jawaban.
 * - AskFinancialQuestionInput - Tipe input untuk fungsi askFinancialQuestion.
 * - AskFinancialQuestionOutput - Tipe kembalian untuk fungsi askFinancialQuestion.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskFinancialQuestionInputSchema = z.object({
  question: z.string().describe('Pertanyaan yang diajukan pengguna.'),
  financialTips: z.string().describe('Tips dan kesimpulan keuangan untuk memberikan konteks bagi pertanyaan tersebut.'),
});

export type AskFinancialQuestionInput = z.infer<typeof AskFinancialQuestionInputSchema>;

const AskFinancialQuestionOutputSchema = z.object({
  answer: z.string().describe('Jawaban atas pertanyaan pengguna, berdasarkan tips dan kesimpulan keuangan yang diberikan.'),
});

export type AskFinancialQuestionOutput = z.infer<typeof AskFinancialQuestionOutputSchema>;

export async function askFinancialQuestion(input: AskFinancialQuestionInput): Promise<AskFinancialQuestionOutput> {
  return askFinancialQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askFinancialQuestionPrompt',
  input: {schema: AskFinancialQuestionInputSchema},
  output: {schema: AskFinancialQuestionOutputSchema},
  prompt: `Anda adalah seorang penasihat keuangan. Seorang pengguna telah menerima tips dan kesimpulan keuangan berikut:

  {{financialTips}}

Pengguna menanyakan pertanyaan berikut tentang tips ini:

  {{question}}

Jawab pertanyaan pengguna dengan jelas dan ringkas, menggunakan informasi yang diberikan dalam tips dan kesimpulan keuangan sebagai konteks. Jangan memberikan nasihat keuangan apa pun di luar cakupan tips dan kesimpulan yang diberikan. Selalu jawab dalam Bahasa Indonesia.`,
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
