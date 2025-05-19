
'use server';
/**
 * @fileOverview A Genkit flow for analyzing cryptocurrencies.
 *
 * - analyzeCryptocurrency - A function that takes a cryptocurrency name and returns an analysis.
 * - AnalyzeCryptocurrencyInput - The input type for the analyzeCryptocurrency function.
 * - AnalyzeCryptocurrencyOutput - The return type for the analyzeCryptocurrency function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCryptocurrencyInputSchema = z.object({
  cryptocurrencyName: z.string().describe('The name of the cryptocurrency to analyze (e.g., Bitcoin, Ethereum).'),
});
export type AnalyzeCryptocurrencyInput = z.infer<typeof AnalyzeCryptocurrencyInputSchema>;

const AnalyzeCryptocurrencyOutputSchema = z.object({
  analysis: z.string().describe('The AI-generated analysis of the cryptocurrency in Bahasa Indonesia.'),
});
export type AnalyzeCryptocurrencyOutput = z.infer<typeof AnalyzeCryptocurrencyOutputSchema>;

export async function analyzeCryptocurrency(input: AnalyzeCryptocurrencyInput): Promise<AnalyzeCryptocurrencyOutput> {
  return analyzeCryptocurrencyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCryptocurrencyPrompt',
  input: {schema: AnalyzeCryptocurrencyInputSchema},
  output: {schema: AnalyzeCryptocurrencyOutputSchema},
  prompt: `Anda adalah seorang analis mata uang kripto AI yang berpengalaman.
  Tugas Anda adalah memberikan analisis ringkas mengenai mata uang kripto bernama: {{{cryptocurrencyName}}}.

  Analisis Anda harus mencakup (jika informasi tersedia dan relevan):
  1.  Deskripsi singkat tentang mata uang kripto tersebut dan tujuannya.
  2.  Sentimen pasar umum saat ini (berdasarkan pengetahuan Anda hingga pembaruan terakhir).
  3.  Potensi kasus penggunaan atau perkembangan penting terbaru.
  4.  Beberapa pertimbangan atau risiko umum yang terkait dengannya.

  PENTING:
  - Selalu berikan respons dalam Bahasa Indonesia yang formal dan jelas.
  - Nyatakan dengan jelas bahwa ini BUKAN nasihat keuangan dan pengguna harus melakukan riset sendiri (DYOR) dan/atau berkonsultasi dengan penasihat keuangan profesional sebelum membuat keputusan investasi.
  - Jaga agar analisis tetap objektif dan informatif.
  - Jika Anda tidak memiliki informasi yang cukup tentang {{{cryptocurrencyName}}}, sebutkan hal tersebut.

  Nama Mata Uang Kripto: {{{cryptocurrencyName}}}

  Analisis Anda (dalam Bahasa Indonesia):
  `,
});

const analyzeCryptocurrencyFlow = ai.defineFlow(
  {
    name: 'analyzeCryptocurrencyFlow',
    inputSchema: AnalyzeCryptocurrencyInputSchema,
    outputSchema: AnalyzeCryptocurrencyOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
