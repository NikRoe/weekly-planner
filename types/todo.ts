export type Todo = {
  id: string;
  title: string;
  status: string;
  notes?: string;
  category?: string;
  time?: string;
  date?: string | null;
};

export type TodoList = Todo[];
