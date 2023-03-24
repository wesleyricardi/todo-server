import { BaseRepository } from "~/repositories/todo_repository";
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
    baseRepositoryMock = jest.fn(() => ({
      store: jest.fn((title: string) => {
        return {
          id: 1,
          title: title,
          completed: false,
        };
      }),
      getAll: jest.fn(() => {
        return [fakeTask, fakeTask2];
      }),
      getById: jest.fn((id: number) => {
        if (id !== fakeID) throw new Error("not found any task with id: " + id);
        return {
          id,
          title: "fake task",
          completed: false,
        };
      }),
      delete: jest.fn((id: number) => {
        if (id !== fakeID) throw new Error("not found any task with id: " + id);
        return;
      }),
      changeToCompleted: jest.fn((id: number) => {
        if (id !== fakeID) throw new Error("not found any task with id: " + id);
        return;
      }),
      changeToIncompleted: jest.fn((id: number) => {
        if (id !== fakeID) throw new Error("not found any task with id: " + id);
        return;
      }),
    }))();
  });

  it("should create a new task", () => {
    const fakeTitle = "new task";
    const model = new TaskModel(baseRepositoryMock);

    const response = model.createTaks(fakeTitle);

    expect(baseRepositoryMock.store).toBeCalledTimes(1);
    expect(baseRepositoryMock.store).toBeCalledWith(fakeTitle);
    expect(response).toStrictEqual({
      id: 1,
      title: fakeTitle,
      completed: false,
    });
  });

  it("should get all tasks", () => {
    const model = new TaskModel(baseRepositoryMock);

    const response = model.getAllTasks();

    expect(baseRepositoryMock.getAll).toBeCalledTimes(1);
    expect(response).toStrictEqual([fakeTask, fakeTask2]);
  });

  it("should delete task", () => {
    const model = new TaskModel(baseRepositoryMock);

    model.deleteTaks(fakeID);
    expect(baseRepositoryMock.delete).toBeCalledTimes(1);
    expect(baseRepositoryMock.delete).toBeCalledWith(fakeID);
  });

  it("should mark task as completed", () => {
    const model = new TaskModel(baseRepositoryMock);

    model.markTaskAsCompleted(fakeID);

    expect(baseRepositoryMock.changeToCompleted).toBeCalledTimes(1);
    expect(baseRepositoryMock.changeToCompleted).toBeCalledWith(fakeID);
  });
});
