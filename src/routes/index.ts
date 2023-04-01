import express from "express";
import { Request, Response } from "express";
import translate_app_error_to_rest from "../error_translate/app_error_to_rest";
import TaskController from "../controller/todo_controller";
import { TaskView } from "../view/todo_view";
import { AppError } from "src/error/error";
import { Task } from "../entities/task";

export const routes = express.Router();

routes.get("/get_all_tasks", async (req: Request, res: Response) => {
  const controller = new TaskController();
  const { responseGetAllTasks } = new TaskView();

  const result = await controller.getAllTaks(responseGetAllTasks);

  result.resolve(
    (response) => {
      res.status(200).json(response);
    },
    (error) => {
      const restError = translate_app_error_to_rest(error);
      res.status(restError.status).json(restError.message);
    }
  );
});

routes.post("/add_task", async (req: Request, res: Response) => {
  if (!req.body?.title) {
    res.sendStatus(400).json({
      message: "Its missing title on body",
    });
    return;
  }
  const { body } = req;

  const controller = new TaskController();
  const { responseAddTask } = new TaskView();

  const result = await controller.addTodo(
    body.title as string,
    responseAddTask
  );

  result.resolve(
    (response) => {
      res.status(201).json(response);
    },
    (error) => {
      const restError = translate_app_error_to_rest(error);
      res.status(restError.status).json(restError.message);
    }
  );
});

routes.delete("/delete_task", async (req: Request, res: Response) => {
  if (!req.query.id) {
    res.sendStatus(400).json({
      message: "Its missing ID on query",
    });
    return;
  }
  const id = parseInt(req.query.id as string);

  if (isNaN(id)) {
    res.sendStatus(400).json({
      message: "ID is not a number",
    });
    return;
  }

  const controller = new TaskController();
  const { responseDeleteTask } = new TaskView();

  const result = await controller.deleteTodoById(id, responseDeleteTask);

  result.resolve(
    (response) => {
      res.status(200).json(response);
    },
    (error) => {
      const restError = translate_app_error_to_rest(error);
      res.status(restError.status).json(restError.message);
    }
  );
});

routes.put("/mark_task_as_completed", async (req: Request, res: Response) => {
  if (!req.query.id) {
    res.sendStatus(400).json({
      message: "Its missing ID on query",
    });
    return;
  }

  const id = parseInt(req.query.id as string);

  if (isNaN(id)) {
    res.sendStatus(400).json({
      message: "ID is not a number",
    });
    return;
  }

  const controller = new TaskController();
  const { responseMarkTaskAsCompleted } = new TaskView();

  const result = await controller.markTodoAsCompleted(
    id,
    responseMarkTaskAsCompleted
  );

  result.resolve(
    (response) => {
      res.status(200).json(response);
    },
    (error) => {
      const restError = translate_app_error_to_rest(error);
      res.status(restError.status).json(restError.message);
    }
  );
});

routes.put("/mark_task_as_incompleted", async (req: Request, res: Response) => {
  if (!req.query.id) {
    res.sendStatus(400).json({
      message: "Its missing ID on query",
    });
    return;
  }
  const id = parseInt(req.query.id as string);

  if (isNaN(id)) {
    res.sendStatus(400).json({
      message: "ID is not a number",
    });
    return;
  }

  const controller = new TaskController();
  const { responseMarkTaskAsIncompleted } = new TaskView();

  const result = await controller.markTodoAsIncompleted(
    id,
    responseMarkTaskAsIncompleted
  );

  result.resolve(
    (response) => {
      res.status(200).json(response);
    },
    (error) => {
      const restError = translate_app_error_to_rest(error);
      res.status(restError.status).json(restError.message);
    }
  );
});
