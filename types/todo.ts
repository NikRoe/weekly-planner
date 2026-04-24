export type Todo = {
  id: string;
  title: string;
  column: string;
  status: string;
  notes?: string;
  category?: string;
  time?: string;
};

export type TodoList = Todo[];
