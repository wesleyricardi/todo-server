type RepositoryTodoParam = {
  title: string;
};

type RepositoryTodoReturn = {
  id: number;
  title: string;
  completed: boolean;
};

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export abstract class BaseRepository {
  abstract store(title: string): RepositoryTodoReturn;

  abstract getAll(): RepositoryTodoReturn[];

  abstract getById(id: number): RepositoryTodoReturn;

  abstract delete(id: number): void;

  abstract changeToCompleted(id: number): void;
}

const todos: Todo[] = [
  {
    id: 1,
    title: "Learn TypeScript",
    completed: false,
  },
  {
    id: 2,
    title: "Build a Todo app",
    completed: false,
  },
];

export class TodoRepositoryMock extends BaseRepository {
  store(title: string): RepositoryTodoReturn {
    const newTodo: Todo = {
      id: todos.length + 1,
      title,
      completed: false,
    };
    todos.push(newTodo);

    return newTodo;
  }
  getAll(): RepositoryTodoReturn[] {
    return todos;
  }

  getById(id: number): RepositoryTodoReturn {
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    return todos[todoIndex];
  }

  delete(id: number): void {
    const todoIndex = todos.findIndex((todo) => todo.id === id);

    todos.splice(todoIndex, 1);
  }

  changeToCompleted(id: number): void {
    const todoIndex = todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      throw new Error("not found task " + id);
    }

    todos[todoIndex].completed = true;
  }
}
