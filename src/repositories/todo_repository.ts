import MySQLConnection from "../database/mysql";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}
export type RepositoryTodoReturn = {
  id: number;
  title: string;
  completed: boolean;
};
export abstract class BaseRepository {
  abstract store(title: string): Promise<RepositoryTodoReturn>;

  abstract getAll(): RepositoryTodoReturn[];

  abstract getById(id: number): RepositoryTodoReturn;

  abstract delete(id: number): void;

  abstract changeToCompleted(id: number): void;

  abstract changeToIncompleted(id: number): void;
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

const connection = new MySQLConnection({
  host: "localhost",
  user: "root",
  password: "Senha@597041",
  database: "todo",
});

export class TaskRepository extends BaseRepository {
  async store(title: string): Promise<RepositoryTodoReturn> {
    try {
      const result = await connection.query(
        "INSERT INTO tasks (title, completed) VALUES (?, ?)",
        [title, false]
      );

      //PAREI AQUI

      const newTodo: Todo = {
        id: todos.length + 1,
        title,
        completed: false,
      };
      todos.push(newTodo);
      return newTodo;
    } catch (e) {
      throw new Error("" + e);
    }
  }
  getAll(): RepositoryTodoReturn[] {
    if (todos.length < 1) {
      throw new Error("not found tasks ");
    }

    return todos;
  }

  getById(id: number): RepositoryTodoReturn {
    const todoIndex = todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      throw new Error("not found task " + id);
    }

    return todos[todoIndex];
  }

  delete(id: number): void {
    const todoIndex = todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      throw new Error("not found task " + id);
    }

    todos.splice(todoIndex, 1);
  }

  changeToCompleted(id: number): void {
    const todoIndex = todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      throw new Error("not found task " + id);
    }

    todos[todoIndex].completed = true;
  }

  changeToIncompleted(id: number): void {
    const todoIndex = todos.findIndex((todo) => todo.id === id);

    if (todoIndex < 0) throw new Error("not found task " + id);

    todos[todoIndex].completed = false;
  }
}
