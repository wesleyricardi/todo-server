import { Ok } from "../lib/ErrorHandler";
import { BaseRepository } from "../repositories/todo_repository";
import { TaskModel } from "./todo_model";

describe("testing todo model", () => {
  let baseRepositoryMock: jest.Mocked<BaseRepository>;
  const fakeID = 1; //use this const for successfully test and other to fail the test
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
    baseRepositoryMock = jest.fn(() => ({
      database,
      store: jest.fn(async (title: string) => {
        return Ok({
          id: 1,
          title: title,
          completed: false,
        });
      }),
      getAll: jest.fn(async () => {
        return Ok([fakeTask, fakeTask2]);
      }),
      getById: jest.fn(async (id: number) => {
        if (id !== fakeID) throw new Error("not found any task with id: " + id);
        return Ok({
          id,
          title: "fake task",
          completed: false,
        });
      }),
      delete: jest.fn(async (id: number) => {
        if (id !== fakeID) throw new Error("not found any task with id: " + id);
        return Ok(null);
      }),
      changeTask: jest.fn(),
    }))();
  });

  it("should create a new task", async () => {
    const fakeTitle = "new task";
    const model = new TaskModel(baseRepositoryMock);

    const result = await model.createTaks(fakeTitle);

    const task = result.success_or_throw;

    expect(baseRepositoryMock.store).toBeCalledTimes(1);
    expect(baseRepositoryMock.store).toBeCalledWith(fakeTitle);
    expect(task).toStrictEqual({
      id: 1,
      title: fakeTitle,
      completed: false,
    });
  });

  it("should get all tasks", async () => {
    const model = new TaskModel(baseRepositoryMock);

    const result = await model.getAllTasks();
    const tasks = result.success_or_throw;

    expect(baseRepositoryMock.getAll).toBeCalledTimes(1);
    expect(tasks).toStrictEqual([fakeTask, fakeTask2]);
  });

  it("should delete task", async () => {
    const model = new TaskModel(baseRepositoryMock);

    const result = (await model.deleteTaks(fakeID)).success_or_throw;

    expect(result).toEqual(1);
    expect(baseRepositoryMock.delete).toBeCalledTimes(1);
    expect(baseRepositoryMock.delete).toBeCalledWith(fakeID);
  });
});
