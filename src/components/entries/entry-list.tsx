
"use client";

import type { FinancialEntry } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id as indonesiaLocale } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EntryListProps {
  entries: FinancialEntry[];
  onEdit: (entry: FinancialEntry) => void;
  onDelete: (id: string) => void;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export function EntryList({ entries, onEdit, onDelete }: EntryListProps) {
  return (
    <ScrollArea className="h-[400px] rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Jenis</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Catatan</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead className="text-right">Jumlah</TableHead>
            <TableHead className="w-[50px] text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                {entry.type === 'income' ? 
                  <TrendingUp className="h-5 w-5 text-green-500" title='Pendapatan' /> : 
                  <TrendingDown className="h-5 w-5 text-red-500" title='Pengeluaran' />}
              </TableCell>
              <TableCell>{format(parseISO(entry.date), "dd MMM yyyy", { locale: indonesiaLocale })}</TableCell>
              <TableCell className="max-w-[200px] truncate">{entry.notes}</TableCell>
              <TableCell>
                {entry.category ? <Badge variant="secondary">{entry.category}</Badge> : '-'}
              </TableCell>
              <TableCell className={`text-right font-medium ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(entry.amount)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(entry)}>
                      <Edit2 className="mr-2 h-4 w-4" /> Ubah
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(entry.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                      <Trash2 className="mr-2 h-4 w-4" /> Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
