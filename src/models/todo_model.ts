import { Task } from "../entities/task";
import { AppError } from "../error/error";
import { Err, Ok, Result } from "../lib/ErrorHandler";
import { BaseRepository } from "../repositories/todo_repository";

export abstract class TodoModel {
  repository: BaseRepository;

  constructor(repository: BaseRepository) {
    this.repository = repository;
  }

  abstract createTaks(title: string): Promise<Result<Task, AppError>>;

  abstract getAllTasks(): Promise<Result<Task[], AppError>>;

  abstract deleteTaks(id: number): Promise<Result<number, AppError>>;

  abstract markTaskAsCompleted(id: number): Promise<Result<number, AppError>>;

  abstract markTaskAsIncompleted(id: number): Promise<Result<number, AppError>>;
}

export class TaskModel extends TodoModel {
  constructor(repository: BaseRepository) {
    super(repository);
  }

  async createTaks(title: string): Promise<Result<Task, AppError>> {
    const result = await this.repository.store(title);
    if (result.error) return Err(result.error);

    return Ok(result.success_or_throw);
  }

  async getAllTasks(): Promise<Result<Task[], AppError>> {
    const result = await this.repository.getAll();
    if (result.error) return Err(result.error);

    return Ok(result.success_or_throw);
  }
  async deleteTaks(id: number): Promise<Result<number, AppError>> {
    const result = await this.repository.delete(id);
    if (result.error) return Err(result.error);

    return Ok(1);
  }
  async markTaskAsCompleted(id: number): Promise<Result<number, AppError>> {
    const result = await this.repository.changeTask(id, undefined, true);
    if (result.error) return Err(result.error);

    return Ok(1);
  }

  async markTaskAsIncompleted(id: number): Promise<Result<number, AppError>> {
    const result = await this.repository.changeTask(id, undefined, false);
    if (result.error) return Err(result.error);

    return Ok(1);
  }
}
