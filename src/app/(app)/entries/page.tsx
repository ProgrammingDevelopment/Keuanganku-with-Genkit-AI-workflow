"use client";

import { useState } from 'react';
import { EntryForm } from '@/components/entries/entry-form';
import { EntryList } from '@/components/entries/entry-list';
import type { FinancialEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

const initialEntries: FinancialEntry[] = [
  { id: '1', type: 'income', date: '2024-07-15', amount: 1200, notes: 'Freelance Project A', category: 'Work' },
  { id: '2', type: 'expense', date: '2024-07-16', amount: 45.50, notes: 'Groceries', category: 'Food' },
  { id: '3', type: 'expense', date: '2024-07-18', amount: 120, notes: 'Electricity Bill', category: 'Utilities' },
];

export default function EntriesPage() {
  const [entries, setEntries] = useState<FinancialEntry[]>(initialEntries);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FinancialEntry | undefined>(undefined);

  const addEntry = (entry: Omit<FinancialEntry, 'id'>) => {
    setEntries(prev => [{ ...entry, id: Date.now().toString() }, ...prev]);
    setIsFormOpen(false);
  };

  const updateEntry = (updatedEntry: FinancialEntry) => {
    setEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
    setEditingEntry(undefined);
    setIsFormOpen(false);
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleEdit = (entry: FinancialEntry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  }

  const openNewEntryDialog = () => {
    setEditingEntry(undefined);
    setIsFormOpen(true);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Entries</h1>
          <p className="text-muted-foreground">Record and manage your income and expenses.</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewEntryDialog}>
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingEntry ? 'Edit Entry' : 'Add New Entry'}</DialogTitle>
              <DialogDescription>
                {editingEntry ? 'Update the details of your financial entry.' : 'Fill in the details for your new income or expense.'}
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

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Entries</CardTitle>
          <CardDescription>View and manage your recorded financial activities.</CardDescription>
        </CardHeader>
        <CardContent>
          {entries.length > 0 ? (
            <EntryList entries={entries} onEdit={handleEdit} onDelete={deleteEntry} />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <ListPlus className="mx-auto h-12 w-12 mb-4" />
              <p className="text-lg">No entries yet.</p>
              <p>Click "Add New Entry" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
