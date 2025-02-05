import { Todo } from "../../types/todo";

export function sortByStatus(a: Todo, b: Todo) {
  const statusA = a.status;
  const statusB = b.status;

  if (statusA > statusB) {
    return -1;
  }
  if (statusB < statusA) {
    return 1;
  }

  return 0;
}
