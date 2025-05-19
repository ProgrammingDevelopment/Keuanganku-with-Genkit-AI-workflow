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
  question: z.string().min(5, { message: "Question must be at least 5 characters." }).max(500, {message: "Question too long (max 500 chars)."}),
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
    form.reset(); // Optionally reset form after submission
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="financial-question">Your Question</FormLabel>
              <FormControl>
                <Textarea
                  id="financial-question"
                  placeholder="e.g., How can I improve my savings rate based on these tips?"
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
          {isLoading ? 'Asking...' : 'Ask AI Assistant'}
        </Button>
      </form>
    </Form>
  );
}
