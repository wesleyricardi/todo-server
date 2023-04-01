import { Task } from "src/entities/task";
import { AppError } from "../error/error";
import { Err, Ok, Result } from "../lib/ErrorHandler";
import { TaskModel, TodoModel } from "../models/todo_model";
import { TaskRepository } from "../repositories/todo_repository";

export abstract class TodoController {
  model: TodoModel;

  constructor(model: TodoModel) {
    this.model = model;
  }

  abstract addTodo<T>(
    title: string,
    view: (task: Task) => T
  ): Promise<Result<T, AppError>>;

  abstract getAllTaks<T>(
    view: (tasks: Task[]) => T[]
  ): Promise<Result<T[], AppError>>;

  abstract markTodoAsCompleted<T>(
    id: number,
    view: () => T
  ): Promise<Result<T, AppError>>;

  abstract markTodoAsIncompleted<T>(
    id: number,
    view: () => T
  ): Promise<Result<T, AppError>>;

  abstract deleteTodoById<T>(
    id: number,
    view: () => T
  ): Promise<Result<T, AppError>>;
}

class TaskController extends TodoController {
  constructor(
    //default value so that it is not necessary to pass it every time the class is instantiated,
    //only passing it when implementing a different implementation or in tests
    model: TodoModel = new TaskModel(new TaskRepository())
  ) {
    super(model);
  }

  public async addTodo<T>(
    title: string,
    view: (task: Task) => T
  ): Promise<Result<T, AppError>> {
    const result = await this.model.createTaks(title);
    if (result.error) return Err(result.error);

    const task = result.success_or_throw;
    return Ok(view(task));
  }

  public async getAllTaks<T>(
    view: (tasks: Task[]) => T[]
  ): Promise<Result<T[], AppError>> {
    const result = await this.model.getAllTasks();
    if (result.error) return Err(result.error);
    const tasks = result.success_or_throw;

    return Ok(view(tasks));
  }

  public async markTodoAsCompleted<T>(
    id: number,
    view: () => T
  ): Promise<Result<T, AppError>> {
    const result = await this.model.markTaskAsCompleted(id);
    if (result.error) return Err(result.error);
    return Ok(view());
  }

  public async markTodoAsIncompleted<T>(
    id: number,
    view: () => T
  ): Promise<Result<T, AppError>> {
    const result = await this.model.markTaskAsIncompleted(id);
    if (result.error) return Err(result.error);
    return Ok(view());
  }

  public async deleteTodoById<T>(
    id: number,
    view: () => T
  ): Promise<Result<T, AppError>> {
    const result = await this.model.deleteTaks(id);
    if (result.error) return Err(result.error);
    return Ok(view());
  }
}

export default TaskController;
