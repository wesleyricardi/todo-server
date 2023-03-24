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

  abstract createTaks(title: string): ModelTask;

  abstract getAllTasks(): ModelTask[];

  abstract deleteTaks(id: number): void;

  abstract markTakAsCompleted(id: number): void;
}

export class TaskModel extends TodoModel {
  constructor(repository: BaseRepository) {
    super(repository);
  }

  createTaks(title: string): ModelTask {
    try {
      return this.repository.store(title);
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
  markTakAsCompleted(id: number): void {
    try {
      this.repository.changeToCompleted(id);
    } catch {
      throw new Error("repository fail to mark the tasks as completed");
    }
  }
}
