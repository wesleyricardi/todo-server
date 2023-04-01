import { Task } from "../entities/task";

export type ViewTodoParam = {
  id: number;
  title: string;
  completed: boolean;
};

export abstract class TodoView {
  abstract responseAddTask(response: ViewTodoParam): Task;

  abstract responseGetAllTasks(response: ViewTodoParam[]): Task[];

  abstract responseDeleteTask(): string;

  abstract responseMarkTaskAsCompleted(): string;

  abstract responseMarkTaskAsIncompleted(): string;
}

export class TaskView extends TodoView {
  responseAddTask(response: ViewTodoParam): Task {
    return response;
  }
  responseGetAllTasks(response: ViewTodoParam[]): Task[] {
    return response;
  }
  responseDeleteTask(): string {
    return "delete successfully";
  }
  responseMarkTaskAsCompleted(): string {
    return "marked as completed";
  }
  responseMarkTaskAsIncompleted(): string {
    return "marked as incompleted";
  }
}

//TODO: CREATE A TESTS FOR VIEWS
