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
import { Wand2, Edit3, FileText, Loader2 } from 'lucide-react'; // Replaced ReceiptText with FileText, added Loader2

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
        const result = await ocrReceipt(input);
        setOcrData(result);
        toast({ title: 'OCR Berhasil', description: 'Data struk berhasil diekstrak.' });
      } catch (err) {
        console.error("Kesalahan OCR:", err);
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui selama pemrosesan OCR.';
        setError(errorMessage);
        toast({ title: 'OCR Gagal', description: errorMessage, variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Gagal membaca berkas.');
      toast({ title: 'Kesalahan Membaca Berkas', description: 'Tidak dapat membaca berkas yang diunggah.', variant: 'destructive' });
      setIsLoading(false);
    };
  };

  const handleCreateEntryFromOcr = () => {
    if (ocrData) {
      setEntryInitialData({
        type: 'expense', 
        date: ocrData.date,
        amount: ocrData.amount,
        notes: `Pembelian di ${ocrData.merchant}`,
        category: ocrData.category,
      });
      setIsEntryFormOpen(true);
    }
  };
  
  const handleEntrySubmit = (entry: Omit<FinancialEntry, 'id'> | FinancialEntry) => {
    console.log("Entri baru dari OCR:", entry);
    toast({ title: "Entri Dibuat", description: `Entri untuk ${entry.notes} berhasil dibuat.`});
    setIsEntryFormOpen(false);
    setOcrData(null); 
  };


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Unggah Struk</h1>
        <p className="text-muted-foreground">
          Unggah gambar struk Anda untuk mengekstrak detailnya secara otomatis.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Pemindai Struk</CardTitle>
            <CardDescription>Pilih berkas gambar (PNG, JPG) struk Anda.</CardDescription>
          </CardHeader>
          <CardContent>
            <ReceiptUploadForm onSubmit={handleReceiptUpload} isLoading={isLoading} />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Informasi yang Diekstrak</CardTitle>
            <CardDescription>Detail dari struk yang Anda unggah akan muncul di sini.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-40">
                <Wand2 className="h-8 w-8 animate-pulse text-primary" />
                <p className="ml-2">Memindai struk Anda...</p>
              </div>
            )}
            {error && <p className="text-destructive">Kesalahan: {error}</p>}
            {ocrData && !isLoading && (
              <>
                <OcrResultDisplay data={ocrData} />
                <Button onClick={handleCreateEntryFromOcr} className="mt-6 w-full">
                  <Edit3 className="mr-2 h-4 w-4" /> Buat Entri dari Struk
                </Button>
              </>
            )}
            {!ocrData && !isLoading && !error && (
              <div className="text-center py-10 text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 mb-4" />
                <p className="text-lg">Belum ada struk yang dipindai.</p>
                <p>Unggah struk untuk melihat detailnya.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEntryFormOpen} onOpenChange={setIsEntryFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Buat Entri Baru dari Struk</DialogTitle>
            <DialogDescription>
              Tinjau dan konfirmasi detail yang diekstrak dari struk Anda.
            </DialogDescription>
          </DialogHeader>
          {entryInitialData && (
             <EntryForm 
                onSubmit={handleEntrySubmit} 
                initialData={entryInitialData as FinancialEntry} 
                onCancel={() => setIsEntryFormOpen(false)}
              />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
