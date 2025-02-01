export type Todo = {
  id: string;
  title: string;
  column: string;
  status: string;
  notes?: string | undefined;
};

export type TodoFromForm = Omit<Todo, "id" | "status">;

export type TodoList = Todo[];
