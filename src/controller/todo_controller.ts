import { Task } from "../entities/task.js";
import { AppError } from "../error/error.js";
import { Err, Ok, Result } from "../utils/ErrorHandler.js";
import { TaskModel, TodoModel } from "../models/todo_model.js";
import { TaskRepository } from "../repositories/todo_repository.js";

export abstract class TodoController {
  model: TodoModel;

  constructor(model: TodoModel) {
    this.model = model;
  }

  abstract create(
    title: string,
  ): Promise<Result<Task, AppError>>;

  abstract getAll(): Promise<Result<Task[], AppError>>;

  abstract get(id: number): Promise<Result<Task, AppError>>;

  abstract update(
    id: number,
    title: string,
    completed: boolean
  ): Promise<Result<string, AppError>>;

  abstract delete(
    id: number,
  ): Promise<Result<string, AppError>>;
}

class TaskController extends TodoController {
  constructor(
    model: TodoModel = new TaskModel(new TaskRepository())
  ) {
    super(model);
  }

  public async create(
    title: string,
  ): Promise<Result<Task, AppError>> {
    return await this.model.create(title);
  }

  public async getAll(): Promise<Result<Task[], AppError>> {
    return await this.model.getAll();
  }

  public async get(id: number): Promise<Result<Task, AppError>> {
    return await this.model.get(id);
  }

  public async update(
    id: number,
    title: string,
    completed: boolean
  ): Promise<Result<string, AppError>> {
    const result = await this.model.update(id, title, completed);
    if (result.error) return Err(result.error);
    return Ok(`updated task ${id}`);
  }


  public async delete(id: number): Promise<Result<string, AppError>> {
    const result = await this.model.delete(id);
    if (result.error) return Err(result.error);
    return Ok(`deleted task ${id}`);
  }
}

export default TaskController;
