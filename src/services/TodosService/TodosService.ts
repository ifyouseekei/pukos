import { Todo } from './TodosService.types.js';

class TodosService {
  private static instance: TodosService | null = null;

  todo: Todo[] = [];

  private constructor() {}

  public static getInstance(): TodosService {
    if (!this.instance) {
      this.instance = new TodosService();
    }

    return this.instance;
  }
}

export default TodosService;
