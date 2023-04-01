import { Task } from "../entities/task";
import { AppError } from "../error/error";
import { Err, Ok } from "../lib/ErrorHandler";
import { TodoModel } from "../models/todo_model";
import { TodoView, ViewTodoParam } from "../view/todo_view";
import TaskController from "./todo_controller";

describe("testing todo controller", () => {
  let todoModelMock: jest.Mocked<TodoModel>;
  let todoViewMock: jest.Mocked<TodoView>;
  const fakeID = 1; //use this const for successfully test and other ID to fail the test
  const fakeTitle = "New task";
  const fakeDeleteReturn = "task deleted successfully";
  const fakeMarkAsCompletedReturn = "task marked as completed successfully";
  const fakeTask = {
    id: 1,
    title: "fake task",
    completed: false,
  };
  const fakeTask2 = {
    id: 2,
    title: "fake task 2",
    completed: false,
  };

  beforeEach(() => {
    const database = jest.fn(() => ({
      query: jest.fn(),
      execute: jest.fn(),
    }))();
    const repository = jest.fn(() => ({
      database,
      store: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      delete: jest.fn(),
      changeTask: jest.fn(),
    }))();

    todoModelMock = jest.fn(() => ({
      repository,
      createTaks: jest.fn(async (title: string) => {
        return Ok({
          id: fakeID,
          title: title,
          completed: false,
        });
      }),
      getAllTasks: jest.fn(async () => {
        return Ok([fakeTask, fakeTask2]);
      }),
      deleteTaks: jest.fn(async (id: number) => {
        if (id !== fakeID)
          return Err(new AppError("not found any task with id: " + id));
        return Ok(1);
      }),
      markTaskAsCompleted: jest.fn(async (id: number) => {
        if (id !== fakeID)
          return Err(new AppError("not found any task with id: " + id));
        return Ok(1);
      }),

      markTaskAsIncompleted: jest.fn(async (id: number) => {
        if (id !== fakeID)
          return Err(new AppError("not found any task with id: " + id));
        return Ok(1);
      }),
    }))();

    todoViewMock = jest.fn(() => ({
      responseAddTask: jest.fn((task: ViewTodoParam): Task => {
        return task;
      }),
      responseGetAllTasks: jest.fn((tasks: ViewTodoParam[]): Task[] => {
        return tasks;
      }),
      responseDeleteTask: jest.fn((): string => {
        return fakeDeleteReturn;
      }),
      responseMarkTaskAsCompleted: jest.fn((): string => {
        return fakeMarkAsCompletedReturn;
      }),
      responseMarkTaskAsIncompleted: jest.fn((): string => {
        return fakeMarkAsCompletedReturn;
      }),
    }))();
  });

  it("should call  model.createTaks and view.responseAddTodo and return the view returns", async () => {
    const controller = new TaskController(todoModelMock);

    const result = await controller.addTodo(
      fakeTitle,
      todoViewMock.responseAddTask
    );

    const task = result.success_or_throw;

    expect(todoModelMock.createTaks).toBeCalledTimes(1);
    expect(todoModelMock.createTaks).toBeCalledWith(fakeTitle);
    expect(todoViewMock.responseAddTask).toBeCalledTimes(1);
    expect(todoViewMock.responseAddTask).toBeCalledWith({
      id: fakeID,
      title: fakeTitle,
      completed: false,
    });
    expect(task).toStrictEqual({
      id: fakeID,
      title: fakeTitle,
      completed: false,
    });
  });

  it("should call model.getAllTasks and view.responseGetAllTasks and return the view returns", async () => {
    const controller = new TaskController(todoModelMock);

    const result = await controller.getAllTaks(
      todoViewMock.responseGetAllTasks
    );
    const response = result.success_or_throw;

    expect(todoModelMock.getAllTasks).toBeCalledTimes(1);
    expect(todoViewMock.responseGetAllTasks).toBeCalledTimes(1);
    expect(todoViewMock.responseGetAllTasks).toBeCalledWith([
      fakeTask,
      fakeTask2,
    ]);
    expect(response).toStrictEqual([fakeTask, fakeTask2]);
  });

  it("should call model.deleteTaks and view.responseDeleteTask and return the view returns", async () => {
    const controller = new TaskController(todoModelMock);

    const response = (
      await controller.deleteTodoById(fakeID, todoViewMock.responseDeleteTask)
    ).success_or_throw;

    expect(todoModelMock.deleteTaks).toBeCalledTimes(1);
    expect(todoModelMock.deleteTaks).toBeCalledWith(fakeID);
    expect(todoViewMock.responseDeleteTask).toBeCalledTimes(1);
    expect(todoViewMock.responseDeleteTask).toBeCalledWith();
    expect(response).toBe(fakeDeleteReturn);
  });

  it("should call model.markTakAsCompleted and view.responseMarkTaskAsCompleted and return the view returns", async () => {
    const controller = new TaskController(todoModelMock);

    const response = (
      await controller.markTodoAsCompleted(
        fakeID,
        todoViewMock.responseMarkTaskAsCompleted
      )
    ).success_or_throw;

    expect(todoModelMock.markTaskAsCompleted).toBeCalledTimes(1);
    expect(todoModelMock.markTaskAsCompleted).toBeCalledWith(fakeID);
    expect(todoViewMock.responseMarkTaskAsCompleted).toBeCalledTimes(1);
    expect(todoViewMock.responseMarkTaskAsCompleted).toBeCalledWith();
    expect(response).toBe(fakeMarkAsCompletedReturn);
  });

  it("should call model.markTaskAsIncompleted and view.responseMarkTaskAsIncompleted and return the view returns", async () => {
    const controller = new TaskController(todoModelMock);

    const response = (
      await controller.markTodoAsIncompleted(
        fakeID,
        todoViewMock.responseMarkTaskAsIncompleted
      )
    ).success_or_throw;

    expect(todoModelMock.markTaskAsIncompleted).toBeCalledTimes(1);
    expect(todoModelMock.markTaskAsIncompleted).toBeCalledWith(fakeID);
    expect(todoViewMock.responseMarkTaskAsIncompleted).toBeCalledTimes(1);
    expect(todoViewMock.responseMarkTaskAsIncompleted).toBeCalledWith();
    expect(response).toBe(fakeMarkAsCompletedReturn);
  });
});
