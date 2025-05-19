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
import { RefreshCw, Bot, MessageSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Mock entries data for demonstration
const mockEntries: FinancialEntry[] = [
  { id: '1', type: 'income', date: '2024-07-01', amount: 3000, notes: 'Salary July', category: 'Salary' },
  { id: '2', type: 'expense', date: '2024-07-02', amount: 1000, notes: 'Rent', category: 'Housing' },
  { id: '3', type: 'expense', date: '2024-07-05', amount: 150, notes: 'Groceries', category: 'Food' },
  { id: '4', type: 'expense', date: '2024-07-10', amount: 200, notes: 'Dining Out', category: 'Food' },
  { id: '5', type: 'income', date: '2024-07-15', amount: 500, notes: 'Freelance Gig', category: 'Side Hustle' },
  { id: '6', type: 'expense', date: '2024-07-20', amount: 80, notes: 'Subscription Services', category: 'Entertainment' },
];

export default function TipsPage() {
  const [tips, setTips] = useState<FinancialTipsOutput | null>(null);
  const [isLoadingTips, setIsLoadingTips] = useState(false);
  const [questionAnswer, setQuestionAnswer] = useState<string | null>(null);
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);
  const { toast } = useToast();

  const fetchFinancialTips = async () => {
    setIsLoadingTips(true);
    setTips(null); // Clear previous tips
    setQuestionAnswer(null); // Clear previous answer
    try {
      // In a real app, fetch entries from a database or state management
      const financialData: FinancialDataInput = {
        incomeEntries: mockEntries.filter(e => e.type === 'income').map(e => ({ date: e.date, amount: e.amount, notes: e.notes })),
        expenseEntries: mockEntries.filter(e => e.type === 'expense').map(e => ({ date: e.date, amount: e.amount, notes: e.notes })),
      };
      const result = await getPersonalizedFinancialTips(financialData);
      setTips(result);
    } catch (err) {
      console.error("Error fetching tips:", err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch financial tips.';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsLoadingTips(false);
    }
  };

  // Fetch tips on initial load
  useEffect(() => {
    fetchFinancialTips();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleAskQuestion = async (question: string) => {
    if (!tips) {
      toast({ title: 'Error', description: 'Please generate tips first.', variant: 'destructive' });
      return;
    }
    setIsLoadingAnswer(true);
    setQuestionAnswer(null);
    try {
      const combinedTipsContext = `Summary: ${tips.summary}. Issues: ${tips.potentialIssues.join(', ')}. Advice: ${tips.advice.join(', ')}.`;
      const input: AskFinancialQuestionInput = {
        question,
        financialTips: combinedTipsContext,
      };
      const result = await askFinancialQuestion(input);
      setQuestionAnswer(result.answer);
    } catch (err) {
      console.error("Error asking question:", err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to get answer for your question.';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsLoadingAnswer(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personalized Financial Tips</h1>
          <p className="text-muted-foreground">AI-powered insights to help you manage your finances better.</p>
        </div>
        <Button onClick={fetchFinancialTips} disabled={isLoadingTips}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingTips ? 'animate-spin' : ''}`} />
          {isLoadingTips ? 'Refreshing...' : 'Refresh Tips'}
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="mr-2 h-6 w-6 text-primary" /> Your Financial Analysis
          </CardTitle>
          <CardDescription>Based on your recent income and expense entries.</CardDescription>
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
            <p className="text-muted-foreground">Click "Refresh Tips" to generate your personalized financial advice.</p>
          )}
        </CardContent>
      </Card>

      {tips && !isLoadingTips && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-6 w-6 text-accent" /> Ask About Your Tips
            </CardTitle>
            <CardDescription>Have questions about the analysis? Ask the AI assistant.</CardDescription>
          </CardHeader>
          <CardContent>
            <AskQuestionForm onSubmit={handleAskQuestion} isLoading={isLoadingAnswer} />
            {isLoadingAnswer && (
              <div className="mt-4 flex items-center text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Getting your answer...</span>
              </div>
            )}
            {questionAnswer && !isLoadingAnswer && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">AI Assistant's Answer:</h3>
                <p className="text-sm whitespace-pre-wrap">{questionAnswer}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
