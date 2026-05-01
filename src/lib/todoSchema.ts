import { z } from "zod";

export const todoSchema = z.object({
  title: z.string().min(3, "Der Titel muss mindestens 3 Zeichen lang sein"),
  date: z.string().optional(),
  notes: z.string().optional(),
  category: z.string().optional(),
  time: z.string().optional(),
});

export type TodoFromForm = z.infer<typeof todoSchema>;
