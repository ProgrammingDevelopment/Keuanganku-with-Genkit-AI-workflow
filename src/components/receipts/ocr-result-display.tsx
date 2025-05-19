"use client";

import type { OcrData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format, parseISO } from 'date-fns';

interface OcrResultDisplayProps {
  data: OcrData;
}

function formatDisplayDate(dateString: string): string {
  try {
    // Assuming dateString is YYYY-MM-DD from AI
    return format(parseISO(dateString), 'MMMM dd, yyyy');
  } catch (e) {
    return dateString; // fallback to original if parsing fails
  }
}

export function OcrResultDisplay({ data }: OcrResultDisplayProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="ocr-merchant">Merchant</Label>
        <Input id="ocr-merchant" value={data.merchant} readOnly disabled className="bg-muted/50" />
      </div>
      <div>
        <Label htmlFor="ocr-date">Date</Label>
        <Input id="ocr-date" value={formatDisplayDate(data.date)} readOnly disabled className="bg-muted/50" />
      </div>
      <div>
        <Label htmlFor="ocr-amount">Amount</Label>
        <Input id="ocr-amount" value={`$${data.amount.toFixed(2)}`} readOnly disabled className="bg-muted/50" />
      </div>
      <div>
        <Label htmlFor="ocr-category">Category</Label>
        <Input id="ocr-category" value={data.category} readOnly disabled className="bg-muted/50" />
      </div>
    </div>
  );
}
