"use client";

import type { FinancialTipsOutput } from '@/ai/flows/personalized-financial-tips';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

interface FinancialTipsDisplayProps {
  tips: FinancialTipsOutput;
}

export function FinancialTipsDisplay({ tips }: FinancialTipsDisplayProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary"/>Ringkasan</h3>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{tips.summary}</p>
      </div>

      <Accordion type="multiple" defaultValue={['issues', 'advice']} className="w-full">
        {tips.potentialIssues && tips.potentialIssues.length > 0 && (
          <AccordionItem value="issues">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-destructive" /> Potensi Masalah
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {tips.potentialIssues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}

        {tips.advice && tips.advice.length > 0 && (
           <AccordionItem value="advice">
            <AccordionTrigger className="text-lg font-semibold">
               <div className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" /> Saran yang Dapat Dilakukan
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {tips.advice.map((adviceItem, index) => (
                  <li key={index}>{adviceItem}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
      
      {tips.answer && (
         <div>
            <h3 className="text-lg font-semibold mb-2">Mengenai Pertanyaan Anda:</h3>
            <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md whitespace-pre-wrap">{tips.answer}</p>
        </div>
      )}
    </div>
  );
}
