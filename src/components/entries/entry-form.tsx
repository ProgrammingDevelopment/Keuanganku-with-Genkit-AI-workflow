"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FinancialEntry } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CalendarIcon, Save } from "lucide-react";
import { format, parseISO } from "date-fns";
import { id as indonesiaLocale } from "date-fns/locale"; // For Indonesian date format

const entrySchema = z.object({
  type: z.enum(["income", "expense"], { required_error: "Silakan pilih jenis entri." }),
  date: z.date({ required_error: "Silakan pilih tanggal." }),
  amount: z.coerce.number().positive({ message: "Jumlah harus berupa angka positif." }),
  notes: z.string().min(1, { message: "Catatan tidak boleh kosong." }).max(200, {message: "Catatan terlalu panjang (maks 200 karakter)."}),
  category: z.string().optional(),
});

type EntryFormValues = z.infer<typeof entrySchema>;

interface EntryFormProps {
  onSubmit: (data: Omit<FinancialEntry, 'id'> | FinancialEntry) => void;
  initialData?: FinancialEntry;
  onCancel?: () => void;
}

export function EntryForm({ onSubmit, initialData, onCancel }: EntryFormProps) {
  const form = useForm<EntryFormValues>({
    resolver: zodResolver(entrySchema),
    defaultValues: initialData ? {
      ...initialData,
      date: initialData.date ? parseISO(initialData.date) : new Date(),
    } : {
      type: "expense",
      date: new Date(),
      amount: 0,
      notes: "",
      category: "",
    },
  });

  const handleSubmit = (data: EntryFormValues) => {
    const entryData = {
      ...data,
      date: format(data.date, "yyyy-MM-dd"), 
    };
    if (initialData?.id) {
      onSubmit({ ...entryData, id: initialData.id });
    } else {
      onSubmit(entryData);
    }
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis entri" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="income">Pendapatan</SelectItem>
                  <SelectItem value="expense">Pengeluaran</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tanggal</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: indonesiaLocale })
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    locale={indonesiaLocale}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" {...field} step="0.01" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori (Opsional)</FormLabel>
              <FormControl>
                <Input placeholder="cth: Belanja, Gaji" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan</FormLabel>
              <FormControl>
                <Textarea placeholder="Deskripsikan entri..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-2">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>}
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" /> {initialData ? 'Simpan Perubahan' : 'Tambah Entri'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
