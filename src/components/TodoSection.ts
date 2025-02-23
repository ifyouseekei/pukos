import TodosService from '../services/TodosService/TodosService.js';
import { Todo } from '../services/TodosService/TodosService.types.js';
import { getOrThrowElement } from '../utils/getOrThrowElement.js';
import { Observable } from '../utils/Observable.js';

class TodoSection {
  private static instance: TodoSection | null = null;
  private todosService: TodosService;
  private error = new Observable<string | null>(null);
  private isLoading = new Observable<boolean>(false);
  private todoContainerEl: HTMLUListElement;

  private constructor(todosService: TodosService) {
    this.todosService = todosService;
    this.todoContainerEl = getOrThrowElement('#todo-container-ul');

    this.init();
  }

  public static getInstance(): TodoSection {
    if (!this.instance) {
      return new TodoSection(TodosService.getInstance());
    }
    return this.instance;
  }

  private async init() {
    await this.initializeList();
    this.todosService.todos.subscribe(this.displayTodos.bind(this));
  }

  private async initializeList() {
    this.isLoading.setValue(true);
    const [, error] = await this.todosService.getUncompletedList();
    this.isLoading.setValue(false);

    if (error) {
      this.error.setValue(error.message);
      return;
    }
  }

  private displayTodos(todos: Todo[]) {
    // Clear the existing list before re-rendering
    this.todoContainerEl.innerHTML = '';

    // Loop through each todo and add it to the list
    todos.forEach((todo) => {
      const li = document.createElement('li');
      li.innerHTML = this.getTemplate(todo);
      this.todoContainerEl.appendChild(li);
    });
  }

  private getTemplate(todo: Todo): string {
    return /* html */ `
      <div id="todo-li-${todo.id}">
        <p>${todo.title}</p>
        <p>${todo.description}</p>
      </div>
    `;
  }
}

export default TodoSection;
