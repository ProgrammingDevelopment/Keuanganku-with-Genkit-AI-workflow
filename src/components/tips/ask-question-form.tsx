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
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

const questionSchema = z.object({
  question: z.string().min(5, { message: "Pertanyaan minimal 5 karakter." }).max(500, {message: "Pertanyaan terlalu panjang (maks 500 karakter)."}),
});

type QuestionFormValues = z.infer<typeof questionSchema>;

interface AskQuestionFormProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
}

export function AskQuestionForm({ onSubmit, isLoading }: AskQuestionFormProps) {
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: "",
    },
  });

  const handleSubmit = (data: QuestionFormValues) => {
    onSubmit(data.question);
    form.reset(); 
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="financial-question">Pertanyaan Anda</FormLabel>
              <FormControl>
                <Textarea
                  id="financial-question"
                  placeholder="cth: Bagaimana cara meningkatkan rasio tabungan saya berdasarkan tips ini?"
                  className="min-h-[100px]"
                  {...field}
                  data-ai-hint="financial question"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Menanyakan...' : 'Tanya Asisten AI'}
        </Button>
      </form>
    </Form>
  );
}
