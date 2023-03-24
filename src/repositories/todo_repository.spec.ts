import { TaskRepository } from "./todo_repository";

describe("Test for todo repository", () => {
  it("should create a new task", async () => {
    const fakeTitle = "Task title";
    const todo_repository = new TaskRepository();

    const response = await todo_repository.store(fakeTitle);

    expect(response).toStrictEqual({
      id: 3,
      title: fakeTitle,
      completed: false,
    });
  });
});
