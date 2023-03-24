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
    const repository = jest.fn(() => ({
      store: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      delete: jest.fn(),
      changeToCompleted: jest.fn(),
      changeToIncompleted: jest.fn(),
    }))();

    todoModelMock = jest.fn(() => ({
      repository,
      createTaks: jest.fn((title: string) => {
        return {
          id: fakeID,
          title: title,
          completed: false,
        };
      }),
      getAllTasks: jest.fn(() => {
        return [fakeTask, fakeTask2];
      }),
      deleteTaks: jest.fn((id: number) => {
        if (id !== fakeID) throw new Error("not found any task with id: " + id);
        return;
      }),
      markTaskAsCompleted: jest.fn((id: number) => {
        if (id !== fakeID) throw new Error("not found any task with id: " + id);
        return;
      }),

      markTaskAsIncompleted: jest.fn((id: number) => {
        if (id !== fakeID) throw new Error("not found any task with id: " + id);
        return;
      }),
    }))();

    todoViewMock = jest.fn(() => ({
      responseAddTask: jest.fn((task: ViewTodoParam) => {
        return task;
      }),
      responseGetAllTasks: jest.fn((tasks: ViewTodoParam[]) => {
        return tasks;
      }),
      responseDeleteTask: jest.fn(() => {
        return fakeDeleteReturn;
      }),
      responseMarkTaskAsCompleted: jest.fn(() => {
        return fakeMarkAsCompletedReturn;
      }),
      responseMarkTaskAsIncompleted: jest.fn(() => {
        return fakeMarkAsCompletedReturn;
      }),
    }))();
  });

  it("should call  model.createTaks and view.responseAddTodo and return the view returns", () => {
    const controller = new TaskController(todoModelMock, todoViewMock);

    const response = controller.addTodo(fakeTitle) as {
      id: number;
      title: string;
      completed: boolean;
    };

    expect(todoModelMock.createTaks).toBeCalledTimes(1);
    expect(todoModelMock.createTaks).toBeCalledWith(fakeTitle);
    expect(todoViewMock.responseAddTask).toBeCalledTimes(1);
    expect(todoViewMock.responseAddTask).toBeCalledWith({
      id: fakeID,
      title: fakeTitle,
      completed: false,
    });
    expect(response).toStrictEqual({
      id: fakeID,
      title: fakeTitle,
      completed: false,
    });
  });

  it("should call model.getAllTasks and view.responseGetAllTasks and return the view returns", () => {
    const controller = new TaskController(todoModelMock, todoViewMock);

    const response = controller.getAllTaks() as {
      id: number;
      title: string;
      completed: boolean;
    }[];

    expect(todoModelMock.getAllTasks).toBeCalledTimes(1);
    expect(todoViewMock.responseGetAllTasks).toBeCalledTimes(1);
    expect(todoViewMock.responseGetAllTasks).toBeCalledWith([
      fakeTask,
      fakeTask2,
    ]);
    expect(response).toStrictEqual([fakeTask, fakeTask2]);
  });

  it("should call model.deleteTaks and view.responseDeleteTask and return the view returns", () => {
    const controller = new TaskController(todoModelMock, todoViewMock);

    const response = controller.deleteTodoById(fakeID) as string;

    expect(todoModelMock.deleteTaks).toBeCalledTimes(1);
    expect(todoModelMock.deleteTaks).toBeCalledWith(fakeID);
    expect(todoViewMock.responseDeleteTask).toBeCalledTimes(1);
    expect(todoViewMock.responseDeleteTask).toBeCalledWith();
    expect(response).toBe(fakeDeleteReturn);
  });

  it("should call model.markTakAsCompleted and view.responseMarkTaskAsCompleted and return the view returns", () => {
    const controller = new TaskController(todoModelMock, todoViewMock);

    const response = controller.markTodoAsCompleted(fakeID) as string;

    expect(todoModelMock.markTaskAsCompleted).toBeCalledTimes(1);
    expect(todoModelMock.markTaskAsCompleted).toBeCalledWith(fakeID);
    expect(todoViewMock.responseMarkTaskAsCompleted).toBeCalledTimes(1);
    expect(todoViewMock.responseMarkTaskAsCompleted).toBeCalledWith();
    expect(response).toBe(fakeMarkAsCompletedReturn);
  });

  it("should call model.markTaskAsIncompleted and view.responseMarkTaskAsIncompleted and return the view returns", () => {
    const controller = new TaskController(todoModelMock, todoViewMock);

    const response = controller.markTodoAsIncompleted(fakeID) as string;

    expect(todoModelMock.markTaskAsIncompleted).toBeCalledTimes(1);
    expect(todoModelMock.markTaskAsIncompleted).toBeCalledWith(fakeID);
    expect(todoViewMock.responseMarkTaskAsIncompleted).toBeCalledTimes(1);
    expect(todoViewMock.responseMarkTaskAsIncompleted).toBeCalledWith();
    expect(response).toBe(fakeMarkAsCompletedReturn);
  });
});
