import { Task } from "../entities/task.js";
import { AppError } from "../error/error.js";
import { Err, Ok } from "../utils/ErrorHandler.js";
import { TodoModel } from "../models/todo_model.js";
import TaskController from "./todo_controller.js";

describe("testing todo controller", () => {
  let todoModelMock: jest.Mocked<TodoModel>;
  const fakeID = 1; //use this const for successfully test and other ID to fail the test
  const fakeTitle = "New task";
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
      get: jest.fn(),
      delete: jest.fn(),
      storeUpdate: jest.fn(),
    }))();

    todoModelMock = jest.fn(() => ({
      repository,
      create: jest.fn(async (title: string) => {
        return Ok({
          id: fakeID,
          title: title,
          completed: false,
        });
      }),
      getAll: jest.fn(async () => {
        return Ok([fakeTask, fakeTask2]);
      }),
      get: jest.fn(async (id: number) => {
        return Ok(fakeTask)
      }),
      delete: jest.fn(async (id: number) => {
        return Ok(1);
      }),
      update: jest.fn(async (id: number, title?:string, completed?:boolean) => {
        return Ok(1);
      })
    }))();
  });

  it("should call model.create", async () => {
    const controller = new TaskController(todoModelMock);

    const result = await controller.create(
      fakeTitle,
    );

    const task = result.success_or_throw;

    expect(todoModelMock.create).toBeCalledTimes(1);
    expect(todoModelMock.create).toBeCalledWith(fakeTitle);
    expect(task).toStrictEqual({
      id: fakeID,
      title: fakeTitle,
      completed: false,
    });
  });

  it("should call model.getAll", async () => {
    const controller = new TaskController(todoModelMock);

    const result = await controller.getAll();
    const response = result.success_or_throw;

    expect(todoModelMock.getAll).toBeCalledTimes(1);
    expect(response).toStrictEqual([fakeTask, fakeTask2]);
  });

  it("should call model.delete", async () => {
    const controller = new TaskController(todoModelMock);

    const response = (
      await controller.delete(fakeID)
    ).success_or_throw;

    expect(todoModelMock.delete).toBeCalledTimes(1);
    expect(todoModelMock.delete).toBeCalledWith(fakeID);
    expect(response).toBe("deleted task 1");
  });

  it("should call model.update", async () => {
    const controller = new TaskController(todoModelMock);

    const response = (
      await controller.update(fakeID, "title update", true)
    ).success_or_throw;

    expect(todoModelMock.update).toBeCalledTimes(1);
    expect(todoModelMock.update).toBeCalledWith(fakeID, "title update", true);
    expect(response).toBe("updated task 1");
  });
});
