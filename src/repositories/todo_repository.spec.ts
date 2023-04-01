import { Ok } from "../lib/ErrorHandler";
import { Database } from "../database/mysql";
import { TaskRepository } from "./todo_repository";

describe("Test for todo repository", () => {
  const fakeTitle = "Task title";
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

  it("should create a new task", async () => {
    const todoDatabaseMock: Database = jest.fn(() => ({
      query: jest.fn(async <T = null>() => {
        return Ok({
          insertId: 1,
        } as unknown as T);
      }),
      execute: jest.fn(),
      getConnection: jest.fn(),
    }))();
    const todo_repository = new TaskRepository(todoDatabaseMock);

    const result = await todo_repository.store(fakeTitle);
    const { id, title, completed } = result.success_or_throw;

    expect(todoDatabaseMock.query).toBeCalledTimes(1);
    expect(todoDatabaseMock.query).toBeCalledWith(
      "INSERT INTO tasks (title, completed) VALUES (?, ?)",
      [fakeTitle, false]
    );
    expect(id).toBe(1);
    expect(title).toBe(fakeTitle);
    expect(completed).toBe(false);
  });

  it("should get all tasks", async () => {
    const todoDatabaseMock: Database = jest.fn(() => ({
      query: jest.fn(async <T = null>() => {
        return Ok([fakeTask, fakeTask2] as unknown as T);
      }),
      execute: jest.fn(),
      getConnection: jest.fn(),
    }))();
    const todo_repository = new TaskRepository(todoDatabaseMock);

    const result = await todo_repository.getAll();
    const tasks = result.success_or_throw;

    expect(todoDatabaseMock.query).toBeCalledTimes(1);
    expect(todoDatabaseMock.query).toBeCalledWith("SELECT * FROM tasks");
    expect(tasks).toStrictEqual([fakeTask, fakeTask2]);
  });

  it("should get task by id", async () => {
    const todoDatabaseMock: Database = jest.fn(() => ({
      query: jest.fn(async <T = null>() => {
        return Ok([fakeTask] as unknown as T);
      }),
      execute: jest.fn(),
      getConnection: jest.fn(),
    }))();
    const todo_repository = new TaskRepository(todoDatabaseMock);

    const result = await todo_repository.getById(fakeTask.id);
    const task = result.success_or_throw;

    expect(todoDatabaseMock.query).toBeCalledTimes(1);
    expect(todoDatabaseMock.query).toBeCalledWith(
      "SELECT * FROM tasks WHERE id = ?",
      [fakeTask.id]
    );
    expect(task).toStrictEqual(fakeTask);
  });

  it("should delete a task", async () => {
    const todoDatabaseMock: Database = jest.fn(() => ({
      query: jest.fn(async <T = null>() => {
        return Ok({ affectedRows: 1 } as unknown as T);
      }),
      execute: jest.fn(),
      getConnection: jest.fn(),
    }))();

    const todo_repository = new TaskRepository(todoDatabaseMock);
    await todo_repository.delete(fakeTask.id);

    expect(todoDatabaseMock.query).toBeCalledTimes(1);
    expect(todoDatabaseMock.query).toBeCalledWith(
      "DELETE FROM tasks WHERE id = ?",
      [fakeTask.id]
    );
  });

  it("should change a task", async () => {
    const todoDatabaseMock: Database = jest.fn(() => ({
      query: jest.fn(async <T = null>() => {
        return Ok({ affectedRows: 1 } as unknown as T);
      }),
      execute: jest.fn(),
      getConnection: jest.fn(),
    }))();
    const todo_repository = new TaskRepository(todoDatabaseMock);

    await todo_repository.changeTask(
      fakeTask.id,
      fakeTask.title,
      fakeTask.completed
    );

    expect(todoDatabaseMock.query).toBeCalledTimes(1);
    expect(todoDatabaseMock.query).toBeCalledWith(
      "UPDATE tasks SET title = ?, completed = ? WHERE id = ?",
      [fakeTask.title, fakeTask.completed, fakeTask.id]
    );
  });

  it("should change only task title", async () => {
    const todoDatabaseMock: Database = jest.fn(() => ({
      query: jest.fn(async <T = null>() => {
        return Ok({ affectedRows: 1 } as unknown as T);
      }),
      execute: jest.fn(),
      getConnection: jest.fn(),
    }))();
    const todo_repository = new TaskRepository(todoDatabaseMock);

    await todo_repository.changeTask(fakeTask.id, fakeTask.title);

    expect(todoDatabaseMock.query).toBeCalledTimes(1);
    expect(todoDatabaseMock.query).toBeCalledWith(
      "UPDATE tasks SET title = ? WHERE id = ?",
      [fakeTask.title, fakeTask.id]
    );
  });

  it("should change only task completion", async () => {
    const todoDatabaseMock: Database = jest.fn(() => ({
      query: jest.fn(async <T = null>() => {
        return Ok({ affectedRows: 1 } as unknown as T);
      }),
      execute: jest.fn(),
      getConnection: jest.fn(),
    }))();
    const todo_repository = new TaskRepository(todoDatabaseMock);

    await todo_repository.changeTask(
      fakeTask.id,
      undefined,
      fakeTask.completed
    );

    expect(todoDatabaseMock.query).toBeCalledTimes(1);
    expect(todoDatabaseMock.query).toBeCalledWith(
      "UPDATE tasks SET completed = ? WHERE id = ?",
      [fakeTask.completed, fakeTask.id]
    );
  });
});
