import { z } from "zod";

export const todoSchema = z.object({
  title: z.string().min(3, "Der Titel muss mindestens 3 Zeichen lang sein"),
  column: z.enum([
    "Backlog",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag",
  ]),
  notes: z.string().optional(),
});

export type TodoFromForm = z.infer<typeof todoSchema>;
