import { BaseRepository } from "~/repositories/todo_repository";

type ModelTask = {
  id: number;
  title: string;
  completed: boolean;
};

export abstract class TodoModel {
  repository: BaseRepository;

  constructor(repository: BaseRepository) {
    this.repository = repository;
  }

  abstract createTaks(title: string): Promise<ModelTask>;

  abstract getAllTasks(): ModelTask[];

  abstract deleteTaks(id: number): void;

  abstract markTaskAsCompleted(id: number): void;

  abstract markTaskAsIncompleted(id: number): void;
}

export class TaskModel extends TodoModel {
  constructor(repository: BaseRepository) {
    super(repository);
  }

  async createTaks(title: string): Promise<ModelTask> {
    try {
      return await this.repository.store(title);
    } catch {
      throw new Error("repository fail to create");
    }
  }
  getAllTasks(): ModelTask[] {
    try {
      return this.repository.getAll();
    } catch {
      throw new Error("repository fail to get tasks");
    }
  }
  deleteTaks(id: number): void {
    try {
      this.repository.delete(id);
    } catch {
      throw new Error("repository fail to delete the tasks");
    }
  }
  markTaskAsCompleted(id: number): void {
    try {
      this.repository.changeToCompleted(id);
    } catch {
      throw new Error("repository fail to mark the tasks as completed");
    }
  }

  markTaskAsIncompleted(id: number): void {
    try {
      this.repository.changeToIncompleted(id);
    } catch {
      throw new Error("repository fail to mark the tasks as incompleted");
    }
  }
}
