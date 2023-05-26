import { Ok } from "../utils/ErrorHandler.js";
import { BaseRepository } from "../repositories/todo_repository.js";
import { TaskModel } from "./todo_model.js";
import { PrismaClient } from "@prisma/client";

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
    const prisma = new PrismaClient();
    baseRepositoryMock = jest.fn(() => ({
      prisma,
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
      get: jest.fn(async (id: number) => {
        return Ok({
          id,
          title: "fake task",
          completed: false,
        });
      }),
      delete: jest.fn(async (id: number) => {
        return Ok(1);
      }),
      storeUpdate: jest.fn(async (id: number, title?:string, boolean?:boolean) => {
        return Ok(1)
      }),
    }))();
  });

  it("should create a new task", async () => {
    const fakeTitle = "new task";
    const model = new TaskModel(baseRepositoryMock);

    const result = await model.create(fakeTitle);

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

    const result = await model.getAll();
    const tasks = result.success_or_throw;

    expect(baseRepositoryMock.getAll).toBeCalledTimes(1);
    expect(tasks).toStrictEqual([fakeTask, fakeTask2]);
  });

  it("should get task", async () => {
    const model = new TaskModel(baseRepositoryMock);

    const result = await model.get(fakeID);
    const tasks = result.success_or_throw;

    expect(baseRepositoryMock.get).toBeCalledTimes(1);
    expect(tasks).toStrictEqual(fakeTask);
  });

  it("should update task", async () => {
    const model =  new TaskModel(baseRepositoryMock);

    const result = (await model.update(1, "update title", true)).success_or_throw;
    
    expect(result).toEqual(1);
    expect(baseRepositoryMock.storeUpdate).toBeCalledTimes(1);
    expect(baseRepositoryMock.storeUpdate).toBeCalledWith(fakeID, "update title", true);
  })

  it("should delete task", async () => {
    const model = new TaskModel(baseRepositoryMock);

    const result = (await model.delete(fakeID)).success_or_throw;

    expect(result).toEqual(1);
    expect(baseRepositoryMock.delete).toBeCalledTimes(1);
    expect(baseRepositoryMock.delete).toBeCalledWith(fakeID);
  });
});
