"use client";

import { useState } from 'react';
import { ReceiptUploadForm } from '@/components/receipts/receipt-upload-form';
import { OcrResultDisplay } from '@/components/receipts/ocr-result-display';
import type { OcrData, FinancialEntry } from '@/lib/types';
import { ocrReceipt, type OcrReceiptInput } from '@/ai/flows/ocr-receipt-upload';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { EntryForm } from '@/components/entries/entry-form';
import { Button } from '@/components/ui/button';
import { Wand2, Edit3 } from 'lucide-react';

export default function ReceiptsPage() {
  const [ocrData, setOcrData] = useState<OcrData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isEntryFormOpen, setIsEntryFormOpen] = useState(false);
  const [entryInitialData, setEntryInitialData] = useState<Partial<FinancialEntry> | undefined>(undefined);

  const handleReceiptUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setOcrData(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        const input: OcrReceiptInput = { receiptDataUri: base64Data };
        const result = await ocrReceipt(input); // Call your GenAI flow
        setOcrData(result);
        toast({ title: 'OCR Successful', description: 'Receipt data extracted.' });
      } catch (err) {
        console.error("OCR Error:", err);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during OCR processing.';
        setError(errorMessage);
        toast({ title: 'OCR Failed', description: errorMessage, variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file.');
      toast({ title: 'File Read Error', description: 'Could not read the uploaded file.', variant: 'destructive' });
      setIsLoading(false);
    };
  };

  const handleCreateEntryFromOcr = () => {
    if (ocrData) {
      setEntryInitialData({
        type: 'expense', // Default to expense
        date: ocrData.date,
        amount: ocrData.amount,
        notes: `Purchase at ${ocrData.merchant}`,
        category: ocrData.category,
      });
      setIsEntryFormOpen(true);
    }
  };
  
  // Mock adding entry - in a real app, this would save to a database
  const handleEntrySubmit = (entry: Omit<FinancialEntry, 'id'> | FinancialEntry) => {
    console.log("New entry from OCR:", entry);
    toast({ title: "Entry Created", description: `Entry for ${entry.notes} created successfully.`});
    setIsEntryFormOpen(false);
    setOcrData(null); // Clear OCR data after creating entry
  };


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Receipt</h1>
        <p className="text-muted-foreground">
          Upload an image of your receipt to automatically extract its details.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Receipt Scanner</CardTitle>
            <CardDescription>Select an image file (PNG, JPG) of your receipt.</CardDescription>
          </CardHeader>
          <CardContent>
            <ReceiptUploadForm onSubmit={handleReceiptUpload} isLoading={isLoading} />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Extracted Information</CardTitle>
            <CardDescription>Details from your uploaded receipt will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-40">
                <Wand2 className="h-8 w-8 animate-pulse text-primary" />
                <p className="ml-2">Scanning your receipt...</p>
              </div>
            )}
            {error && <p className="text-destructive">Error: {error}</p>}
            {ocrData && !isLoading && (
              <>
                <OcrResultDisplay data={ocrData} />
                <Button onClick={handleCreateEntryFromOcr} className="mt-6 w-full">
                  <Edit3 className="mr-2 h-4 w-4" /> Create Entry from Receipt
                </Button>
              </>
            )}
            {!ocrData && !isLoading && !error && (
              <div className="text-center py-10 text-muted-foreground">
                <ReceiptText className="mx-auto h-12 w-12 mb-4" />
                <p className="text-lg">No receipt scanned yet.</p>
                <p>Upload a receipt to see its details.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEntryFormOpen} onOpenChange={setIsEntryFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Entry from Receipt</DialogTitle>
            <DialogDescription>
              Review and confirm the details extracted from your receipt.
            </DialogDescription>
          </DialogHeader>
          {entryInitialData && (
             <EntryForm 
                onSubmit={handleEntrySubmit} 
                // This casting is okay as EntryForm defaultValues will handle date string conversion
                initialData={entryInitialData as FinancialEntry} 
                onCancel={() => setIsEntryFormOpen(false)}
              />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
