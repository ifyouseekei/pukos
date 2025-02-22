import { Todo, TodoInDB } from './TodosService.types.js';

export function toDatabase(todo: Todo): TodoInDB {
  return {
    ...todo,
    createdAt: todo.createdAt.toISOString(),
    isCompleted: todo.isCompleted ? 1 : 0,
  };
}

export function toTodo(todo: TodoInDB): Todo {
  return {
    ...todo,
    createdAt: new Date(todo.createdAt),
    isCompleted: !!todo.isCompleted,
  };
}
