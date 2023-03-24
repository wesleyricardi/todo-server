export type ViewTodoParam = {
  id: number;
  title: string;
  completed: boolean;
};

export abstract class TodoView {
  abstract responseAddTask(response: ViewTodoParam): unknown;

  abstract responseGetAllTasks(response: ViewTodoParam[]): unknown[];

  abstract responseDeleteTask(): string;

  abstract responseMarkTaskAsCompleted(): string;

  abstract responseMarkTaskAsIncompleted(): string;
}

export class TaskView extends TodoView {
  responseAddTask(response: ViewTodoParam): unknown {
    return response;
  }
  responseGetAllTasks(response: ViewTodoParam[]): unknown[] {
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
