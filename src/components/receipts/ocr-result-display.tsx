"use client";

import type { OcrData } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format, parseISO } from 'date-fns';
import { id as indonesiaLocale } from 'date-fns/locale';

interface OcrResultDisplayProps {
  data: OcrData;
}

function formatDisplayDate(dateString: string): string {
  try {
    return format(parseISO(dateString), 'dd MMMM yyyy', { locale: indonesiaLocale });
  } catch (e) {
    return dateString; 
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}


export function OcrResultDisplay({ data }: OcrResultDisplayProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="ocr-merchant">Toko/Merchant</Label>
        <Input id="ocr-merchant" value={data.merchant} readOnly disabled className="bg-muted/50" />
      </div>
      <div>
        <Label htmlFor="ocr-date">Tanggal</Label>
        <Input id="ocr-date" value={formatDisplayDate(data.date)} readOnly disabled className="bg-muted/50" />
      </div>
      <div>
        <Label htmlFor="ocr-amount">Jumlah</Label>
        <Input id="ocr-amount" value={formatCurrency(data.amount)} readOnly disabled className="bg-muted/50" />
      </div>
      <div>
        <Label htmlFor="ocr-category">Kategori</Label>
        <Input id="ocr-category" value={data.category} readOnly disabled className="bg-muted/50" />
      </div>
    </div>
  );
}
