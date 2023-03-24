import { TodoRepositoryMock } from "./todo_repository";

describe("Test for todo repository", () => {
  it("should create a new task", () => {
    const fakeTitle = "Task title";
    const todo_repository = new TodoRepositoryMock();

    const response = todo_repository.store(fakeTitle);

    expect(response).toStrictEqual({
      id: 3,
      title: fakeTitle,
      completed: false,
    });
  });

  it("should get all taks", () => {
    const fakeTitle = "Task title";
    const todo_repository = new TodoRepositoryMock();
    todo_repository.store(fakeTitle);

    const response = todo_repository.getAll();

    expect(response.length).toBeGreaterThan(3);
  });

  it("should get task by id", () => {
    const fakeTitle = "Task title";

    const todo_repository = new TodoRepositoryMock();
    const { id } = todo_repository.store(fakeTitle);

    const response = todo_repository.getById(id);

    expect(response).toStrictEqual({
      id,
      title: fakeTitle,
      completed: false,
    });
  });

  it("should mark as completed", () => {
    const fakeTitle = "Task title";
    const todo_repository = new TodoRepositoryMock();
    const { id } = todo_repository.store(fakeTitle);

    todo_repository.changeToCompleted(id);

    const { completed } = todo_repository.getById(id);

    expect(completed).toBe(true);
  });

  it("should delete a taks", () => {
    const fakeTitle = "Task title";
    const todo_repository = new TodoRepositoryMock();
    const { id } = todo_repository.store(fakeTitle);

    todo_repository.delete(id);

    const index = todo_repository.getAll().findIndex((todo) => todo.id === id);
    expect(index).toBe(-1);
  });

  it("should mark as incompleted", () => {
    const fakeTitle = "Task title";
    const todo_repository = new TodoRepositoryMock();
    const { id } = todo_repository.store(fakeTitle);

    todo_repository.changeToCompleted(id);
    todo_repository.changeToIncompleted(id);

    const { completed } = todo_repository.getById(id);

    expect(completed).toBe(false);
  });
});
