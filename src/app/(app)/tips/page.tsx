"use client";

import { useState, useEffect } from 'react';
import { FinancialTipsDisplay } from '@/components/tips/financial-tips-display';
import { AskQuestionForm } from '@/components/tips/ask-question-form';
import type { FinancialEntry } from '@/lib/types';
import { getPersonalizedFinancialTips, type FinancialDataInput, type FinancialTipsOutput } from '@/ai/flows/personalized-financial-tips';
import { askFinancialQuestion, type AskFinancialQuestionInput, type AskFinancialQuestionOutput } from '@/ai/flows/ask-financial-question';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Bot, MessageSquare, Loader2 } from 'lucide-react'; // Added Loader2
import { Skeleton } from '@/components/ui/skeleton';

const mockEntries: FinancialEntry[] = [
  { id: '1', type: 'income', date: '2024-07-01', amount: 3000000, notes: 'Gaji Juli', category: 'Gaji' },
  { id: '2', type: 'expense', date: '2024-07-02', amount: 1000000, notes: 'Sewa Apartemen', category: 'Tempat Tinggal' },
  { id: '3', type: 'expense', date: '2024-07-05', amount: 150000, notes: 'Belanja Mingguan', category: 'Makanan' },
  { id: '4', type: 'expense', date: '2024-07-10', amount: 200000, notes: 'Makan di Luar', category: 'Makanan' },
  { id: '5', type: 'income', date: '2024-07-15', amount: 500000, notes: 'Proyek Lepas', category: 'Pekerjaan Sampingan' },
  { id: '6', type: 'expense', date: '2024-07-20', amount: 80000, notes: 'Layanan Langganan', category: 'Hiburan' },
];

export default function TipsPage() {
  const [tips, setTips] = useState<FinancialTipsOutput | null>(null);
  const [isLoadingTips, setIsLoadingTips] = useState(false);
  const [questionAnswer, setQuestionAnswer] = useState<string | null>(null);
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);
  const { toast } = useToast();

  const fetchFinancialTips = async () => {
    setIsLoadingTips(true);
    setTips(null); 
    setQuestionAnswer(null); 
    try {
      const financialData: FinancialDataInput = {
        incomeEntries: mockEntries.filter(e => e.type === 'income').map(e => ({ date: e.date, amount: e.amount, notes: e.notes })),
        expenseEntries: mockEntries.filter(e => e.type === 'expense').map(e => ({ date: e.date, amount: e.amount, notes: e.notes })),
      };
      const result = await getPersonalizedFinancialTips(financialData);
      setTips(result);
    } catch (err) {
      console.error("Kesalahan mengambil tips:", err);
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengambil tips keuangan.';
      toast({ title: 'Kesalahan', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsLoadingTips(false);
    }
  };

  useEffect(() => {
    fetchFinancialTips();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleAskQuestion = async (question: string) => {
    if (!tips) {
      toast({ title: 'Kesalahan', description: 'Harap hasilkan tips terlebih dahulu.', variant: 'destructive' });
      return;
    }
    setIsLoadingAnswer(true);
    setQuestionAnswer(null);
    try {
      const combinedTipsContext = `Ringkasan: ${tips.summary}. Masalah: ${tips.potentialIssues.join(', ')}. Saran: ${tips.advice.join(', ')}.`;
      const input: AskFinancialQuestionInput = {
        question,
        financialTips: combinedTipsContext,
      };
      const result = await askFinancialQuestion(input);
      setQuestionAnswer(result.answer);
    } catch (err) {
      console.error("Kesalahan bertanya:", err);
      const errorMessage = err instanceof Error ? err.message : 'Gagal mendapatkan jawaban untuk pertanyaan Anda.';
      toast({ title: 'Kesalahan', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsLoadingAnswer(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tips Keuangan Pribadi</h1>
          <p className="text-muted-foreground">Wawasan bertenaga AI untuk membantu Anda mengelola keuangan dengan lebih baik.</p>
        </div>
        <Button onClick={fetchFinancialTips} disabled={isLoadingTips}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingTips ? 'animate-spin' : ''}`} />
          {isLoadingTips ? 'Menyegarkan...' : 'Segarkan Tips'}
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="mr-2 h-6 w-6 text-primary" /> Analisis Keuangan Anda
          </CardTitle>
          <CardDescription>Berdasarkan entri pendapatan dan pengeluaran terbaru Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingTips ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : tips ? (
            <FinancialTipsDisplay tips={tips} />
          ) : (
            <p className="text-muted-foreground">Klik "Segarkan Tips" untuk menghasilkan saran keuangan pribadi Anda.</p>
          )}
        </CardContent>
      </Card>

      {tips && !isLoadingTips && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-6 w-6 text-accent" /> Tanya Tentang Tips Anda
            </CardTitle>
            <CardDescription>Ada pertanyaan tentang analisis? Tanyakan pada asisten AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <AskQuestionForm onSubmit={handleAskQuestion} isLoading={isLoadingAnswer} />
            {isLoadingAnswer && (
              <div className="mt-4 flex items-center text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Mendapatkan jawaban Anda...</span>
              </div>
            )}
            {questionAnswer && !isLoadingAnswer && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Jawaban Asisten AI:</h3>
                <p className="text-sm whitespace-pre-wrap">{questionAnswer}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
