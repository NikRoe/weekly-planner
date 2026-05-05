import { Todo } from "../../types/todo";

export function sortByStatus(a: Todo, b: Todo) {
  const statusA = a.status;
  const statusB = b.status;

  if (statusA > statusB) {
    return -1;
  }
  if (statusA < statusB) {
    return 1;
  }

  return 0;
}

export function sortByTime(a: Todo, b: Todo) {
  const timeA = a.time;
  const timeB = b.time;

  if (!timeA && !timeB) return 0;
  if (!timeA) return 1;
  if (!timeB) return -1;

  if (timeA > timeB) return 1;
  if (timeA < timeB) return -1;

  return 0;
}
