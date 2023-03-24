import { TaskModel, TodoModel } from "../models/todo_model";
import { TodoRepositoryMock } from "../repositories/todo_repository";
import { TaskView, TodoView } from "../view/todo_view";

export abstract class TodoController {
  model: TodoModel;
  view: TodoView;

  constructor(model: TodoModel, view: TodoView) {
    this.model = model;
    this.view = view;
  }

  abstract addTodo(title: string): unknown;

  abstract getAllTaks(): unknown;

  abstract markTodoAsCompleted(id: number): unknown;

  abstract markTodoAsIncompleted(id: number): unknown;

  abstract deleteTodoById(id: number): unknown;
}

class TaskController extends TodoController {
  constructor(
    model: TodoModel = new TaskModel(new TodoRepositoryMock()), //default value so that it is not necessary to pass it every time the class is instantiated,
    view: TodoView = new TaskView() //only passing it when implementing a different implementation or in tests
  ) {
    super(model, view);
  }

  public addTodo(title: string) {
    try {
      const task = this.model.createTaks(title);
      return this.view.responseAddTask(task);
    } catch {
      throw new Error("fail to create a new tasks");
      //todo: create a test to verify if the error message is correct
    }
  }

  public getAllTaks() {
    try {
      const tasks = this.model.getAllTasks();
      return this.view.responseGetAllTasks(tasks);
    } catch {
      throw new Error("fail to get all tasks");
      //todo: create a test to verify if the error message is correct
    }
  }

  public markTodoAsCompleted(id: number) {
    try {
      this.model.markTaskAsCompleted(id);
      return this.view.responseMarkTaskAsCompleted();
    } catch {
      throw new Error("fail to mark task as completed");
      //todo: create a test to verify if the error message is correct
    }
  }

  public markTodoAsIncompleted(id: number) {
    try {
      this.model.markTaskAsIncompleted(id);
      return this.view.responseMarkTaskAsIncompleted();
    } catch {
      throw new Error("fail to mark task as incompleted");
      //todo: create a test to verify if the error message is correct
    }
  }

  public deleteTodoById(id: number) {
    try {
      this.model.deleteTaks(id);
      return this.view.responseDeleteTask();
    } catch {
      throw new Error("delete task failed");
      //todo: create a test to verify if the error message is correct
    }
  }
}

export default TaskController;
