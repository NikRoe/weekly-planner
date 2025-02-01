export type Todo = {
  id: string;
  title: string;
  column: string;
  status: "Done" | "Open";
  notes?: string;
};

export type TodoList = Todo[];
