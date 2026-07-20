import { TemplateList } from "../../types/template";

export const TASK_TEMPLATES: TemplateList = [
  {
    id: "weekly-planning",
    title: "Wochenplanung",
    notes: "Prioritäten für die Woche festlegen",
    category: "personal",
  },
  {
    id: "einkaufen",
    title: "Einkaufen gehen",
    category: "errand",
  },
  {
    id: "meditieren",
    title: "Meditieren",
    category: "focus",
    time: "09:30",
  },
  {
    id: "splid",
    title: "Splid",
    category: "work",
    time: "10:00",
  },
  {
    id: "bewerbungen",
    title: "Bewerbung",
    category: "work",
    time: "11:00",
  },
  {
    id: "exercise",
    title: "Krafttraining",
    category: "personal",
    notes: `Liegestütz – so viele wie sauber möglich
Kniebeugen – 12–15 Wdh.
Unterarmstütz (Plank) – 20–40 Sek.
Ausfallschritte – 10 pro Bein
Rückenübung: Superman oder Rudern an Tischkante – 12–15 Wdh.`,
  },
  {
    id: "joggen",
    title: "Joggen",
    category: "personal",
  },
];
