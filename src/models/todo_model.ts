import { Task } from "../entities/task.js";
import { AppError } from "../error/error.js";
import { Err, Ok, Result } from "../utils/ErrorHandler.js";
import { BaseRepository } from "../repositories/todo_repository.js";

export abstract class TodoModel {
  repository: BaseRepository;

  constructor(repository: BaseRepository) {
    this.repository = repository;
  }

  abstract create(title: string): Promise<Result<Task, AppError>>;

  abstract getAll(): Promise<Result<Task[], AppError>>;

  abstract get(id: number): Promise<Result<Task, AppError>>;

  abstract delete(id: number): Promise<Result<number, AppError>>;

  abstract update(id: number, title?: string, completed?: boolean): Promise<Result<number, AppError>>;
}

export class TaskModel extends TodoModel {
  constructor(repository: BaseRepository) {
    super(repository);
  }

  async create(title: string): Promise<Result<Task, AppError>> {
    const result = await this.repository.store(title);

    return result;
  }

  async getAll(): Promise<Result<Task[], AppError>> {
    const result = await this.repository.getAll();

    return result;
  }

  async get(id: number): Promise<Result<Task, AppError>> {
    const result = await this.repository.get(id);

    return result;
  }

  async update(id:number, title?: string, completed?: boolean): Promise<Result<number, AppError>> {
    const result = await this.repository.storeUpdate(id, title, completed);

    return result;
  }

  async delete(id: number): Promise<Result<number, AppError>> {
    const result = await this.repository.delete(id);

    return result;
  }
}
