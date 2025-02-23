import { Observable } from '../../utils/Observable.js';
import TodoDB from './TodoDB.js';
import { Todo } from './TodosService.types.js';

class TodosService {
  private static instance: TodosService | null = null;

  public todos = new Observable<Todo[]>([]);
  private todoDB = TodoDB.getInstance();

  private constructor() {
    this.init();
  }

  async init() {
    await this.todoDB.initDB();
  }

  public static getInstance(): TodosService {
    if (!this.instance) {
      this.instance = new TodosService();
    }

    return this.instance;
  }

  public getUncompletedList(): Promise<AppResponseType<Todo[]>> {
    return this.todoDB.getList({ isCompleted: false });
  }

  public getCompletedList(): Promise<AppResponseType<Todo[]>> {
    return this.todoDB.getList({ isCompleted: true });
  }

  public getAll(): Promise<AppResponseType<Todo[]>> {
    return this.todoDB.getList({});
  }

  public async addTodo(todo: Todo): Promise<Error | null> {
    // Process to db
    const [, error] = await this.todoDB.add(todo);
    if (error) {
      return error;
    }

    // Update local state
    this.todos.getValue().unshift(todo);

    return null;
  }

  public async markAsDone(id: Todo['id']): Promise<Error | null> {
    // Process to db
    const todoToUpdate = this.todos.getValue().find((todo) => todo.id === id);
    if (!todoToUpdate) {
      return null;
    }

    const [result, error] = await this.todoDB.update({
      ...todoToUpdate,
      isCompleted: true,
    });
    if (error) {
      return error;
    }

    // Update local state
    const updatedTodo = this.todos.getValue().map((todo) => {
      if (todo.id !== id) {
        return todo;
      }

      return result;
    });

    this.todos.setValue(updatedTodo);

    return null;
  }
}

export default TodosService;
