
'use server';
/**
 * @fileOverview Memberikan tips dan wawasan keuangan yang dipersonalisasi berdasarkan data pendapatan dan pengeluaran pengguna.
 *
 * - getPersonalizedFinancialTips - Fungsi yang memproses data keuangan pengguna dan mengembalikan saran yang disesuaikan.
 * - FinancialDataInput - Tipe input untuk fungsi getPersonalizedFinancialTips, mewakili catatan keuangan pengguna.
 * - FinancialTipsOutput - Tipe kembalian untuk fungsi getPersonalizedFinancialTips, berisi saran keuangan yang dipersonalisasi.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialDataInputSchema = z.object({
  incomeEntries: z.array(
    z.object({
      date: z.string().describe('Tanggal entri pendapatan'),
      amount: z.number().describe('Jumlah pendapatan'),
      notes: z.string().describe('Deskripsi sumber pendapatan'),
    })
  ).describe('Array entri pendapatan dengan tanggal, jumlah, dan catatan.'),
  expenseEntries: z.array(
    z.object({
      date: z.string().describe('Tanggal entri pengeluaran'),
      amount: z.number().describe('Jumlah pengeluaran'),
      notes: z.string().describe('Deskripsi pengeluaran'),
    })
  ).describe('Array entri pengeluaran dengan tanggal, jumlah, dan catatan.'),
  userQuestion: z.string().optional().describe('Pertanyaan opsional dari pengguna mengenai analisis keuangan.'),
});
export type FinancialDataInput = z.infer<typeof FinancialDataInputSchema>;

const FinancialTipsOutputSchema = z.object({
  summary: z.string().describe('Ringkasan situasi keuangan pengguna.'),
  potentialIssues: z.array(z.string()).describe('Daftar potensi masalah keuangan yang teridentifikasi.'),
  advice: z.array(z.string()).describe('Saran keuangan yang dapat ditindaklanjuti dan disesuaikan untuk pengguna.'),
  answer: z.string().optional().describe('Jawaban atas pertanyaan pengguna, jika ada.'),
});
export type FinancialTipsOutput = z.infer<typeof FinancialTipsOutputSchema>;

export async function getPersonalizedFinancialTips(input: FinancialDataInput): Promise<FinancialTipsOutput> {
  return personalizedFinancialTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedFinancialTipsPrompt',
  input: {schema: FinancialDataInputSchema},
  output: {schema: FinancialTipsOutputSchema},
  prompt: `Anda adalah penasihat keuangan pribadi. Analisis data pendapatan dan pengeluaran pengguna untuk mengidentifikasi potensi masalah keuangan dan memberikan saran yang dapat ditindaklanjuti. Selalu berikan respons dalam Bahasa Indonesia.

Entri Pendapatan:
{{#each incomeEntries}}
- Tanggal: {{date}}, Jumlah: {{amount}}, Catatan: {{notes}}
{{/each}}

Entri Pengeluaran:
{{#each expenseEntries}}
- Tanggal: {{date}}, Jumlah: {{amount}}, Catatan: {{notes}}
{{/each}}

{{#if userQuestion}}Pertanyaan Pengguna: {{{userQuestion}}}{{/if}}

Berdasarkan data ini, berikan ringkasan situasi keuangan pengguna, identifikasi potensi masalah, dan sarankan tindakan yang dapat diambil. Jika pengguna memiliki pertanyaan, jawablah berdasarkan analisis Anda.

Pastikan keluarannya terstruktur dengan baik dan mudah dipahami, dan seluruhnya dalam Bahasa Indonesia.

Ringkasan:
{{summary}}

Potensi Masalah:
{{#each potentialIssues}}
- {{this}}
{{/each}}

Saran:
{{#each advice}}
- {{this}}
{{/each}}

{{#if answer}}Jawaban: {{{answer}}}{{/if}}
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
