
"use client";

import { useState } from 'react';
import { EntryForm } from '@/components/entries/entry-form';
import { EntryList } from '@/components/entries/entry-list';
import type { FinancialEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, ListPlus, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const initialEntries: FinancialEntry[] = [
  { id: '1', type: 'income', date: '2024-07-15', amount: 1200000, notes: 'Proyek Lepas A', category: 'Pekerjaan' },
  { id: '2', type: 'expense', date: '2024-07-16', amount: 45500, notes: 'Belanja Bulanan', category: 'Makanan' },
  { id: '3', type: 'expense', date: '2024-07-18', amount: 120000, notes: 'Tagihan Listrik', category: 'Utilitas' },
];

export default function EntriesPage() {
  const [entries, setEntries] = useState<FinancialEntry[]>(initialEntries);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FinancialEntry | undefined>(undefined);
  const { toast } = useToast();

  const addEntry = (entry: Omit<FinancialEntry, 'id'>) => {
    setEntries(prev => [{ ...entry, id: Date.now().toString() }, ...prev]);
    setIsFormOpen(false);
    toast({ title: 'Entri Ditambahkan', description: 'Entri keuangan baru Anda telah dicatat.' });
  };

  const updateEntry = (updatedEntry: FinancialEntry) => {
    setEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
    setEditingEntry(undefined);
    setIsFormOpen(false);
    toast({ title: 'Entri Diperbarui', description: 'Entri keuangan telah diperbarui.' });
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    toast({ title: 'Entri Dihapus', description: 'Entri keuangan telah dihapus.', variant: 'destructive' });
  };

  const handleEdit = (entry: FinancialEntry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  }

  const openNewEntryDialog = () => {
    setEditingEntry(undefined);
    setIsFormOpen(true);
  }

  const exportToCSV = () => {
    if (entries.length === 0) {
      toast({ title: 'Tidak Ada Entri', description: 'Tidak ada entri untuk diekspor.', variant: 'destructive' });
      return;
    }

    const header = ['ID', 'Jenis', 'Tanggal', 'Jumlah', 'Catatan', 'Kategori'];
    const rows = entries.map(entry => 
      [
        entry.id,
        entry.type === 'income' ? 'Pendapatan' : 'Pengeluaran',
        entry.date,
        entry.amount.toString(),
        entry.notes.includes(',') ? `"${entry.notes}"` : entry.notes,
        entry.category?.includes(',') ? `"${entry.category}"` : entry.category || ''
      ].join(',')
    );

    const csvContent = [header.join(','), ...rows].join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' }); // Added BOM for Excel
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'entri_keuangan.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({ title: 'Ekspor Berhasil', description: 'Entri keuangan Anda telah diekspor ke CSV.' });
    } else {
       toast({ title: 'Ekspor Gagal', description: 'Peramban Anda tidak mendukung fitur ini.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Entri Keuangan</h1>
          <p className="text-muted-foreground">Catat dan kelola pendapatan serta pengeluaran Anda.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline">
            <Download className="mr-2 h-5 w-5" /> Ekspor ke CSV
          </Button>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewEntryDialog}>
                <PlusCircle className="mr-2 h-5 w-5" /> Tambah Entri Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingEntry ? 'Ubah Entri' : 'Tambah Entri Baru'}</DialogTitle>
                <DialogDescription>
                  {editingEntry ? 'Perbarui detail entri keuangan Anda.' : 'Isi detail untuk pendapatan atau pengeluaran baru Anda.'}
                </DialogDescription>
              </DialogHeader>
              <EntryForm 
                onSubmit={editingEntry ? updateEntry : addEntry} 
                initialData={editingEntry} 
                onCancel={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Semua Entri</CardTitle>
          <CardDescription>Lihat dan kelola aktivitas keuangan yang telah Anda catat.</CardDescription>
        </CardHeader>
        <CardContent>
          {entries.length > 0 ? (
            <EntryList entries={entries} onEdit={handleEdit} onDelete={deleteEntry} />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <ListPlus className="mx-auto h-12 w-12 mb-4" />
              <p className="text-lg">Belum ada entri.</p>
              <p>Klik "Tambah Entri Baru" untuk memulai.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
