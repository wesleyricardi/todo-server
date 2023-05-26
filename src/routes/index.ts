import express from "express";
import { Request, Response } from "express";
import translate_app_error_to_rest from "../utils/adapters/app_err_to_rest.js";
import TaskController from "../controller/todo_controller.js";
import { AppError } from "../error/error.js";
import { Task } from "../entities/task.js";

export const routes = express.Router();

routes.get("/tasks", async (req: Request, res: Response) => {
  const controller = new TaskController();
  const result = await controller.getAll();

  result.resolve(
    (response: Task[]) => {
      res.status(200).json(response);
    },
    (error: AppError) => {
      const restError = translate_app_error_to_rest(error);
      res.status(restError.status).json(restError.message);
    }
  );
});

routes.get("/task/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    res.sendStatus(400).json({
      message: "ID is not a number",
    });
    return;
  }

  const controller = new TaskController();
  const result = await controller.get(id);

  result.resolve(
    (response: Task) => {
      res.status(200).json(response);
    },
    (error: AppError) => {
      const restError = translate_app_error_to_rest(error);
      res.status(restError.status).json(restError.message);
    }
  );
});

routes.post("/task", async (req: Request, res: Response) => {
  if (!req.body?.title) {
    res.sendStatus(400).json({
      message: "Its missing title on body",
    });
    return;
  }
  const { body } = req;

  const controller = new TaskController();
  const result = await controller.create(
    body.title as string
  );

  result.resolve(
    (response: Task) => {
      res.status(201).json(response);
    },
    (error: AppError) => {
      const restError = translate_app_error_to_rest(error);
      res.status(restError.status).json(restError.message);
    }
  );
});

routes.delete("/task/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    res.sendStatus(400).json({
      message: "ID is not a number",
    });
    return;
  }

  const controller = new TaskController();
  const result = await controller.delete(id);

  result.resolve(
    (response: string) => {
      res.status(200).json(response);
    },
    (error: AppError) => {
      const restError = translate_app_error_to_rest(error);
      res.status(restError.status).json(restError.message);
    }
  );
});

routes.put("/task/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    res.sendStatus(400).json({
      message: "ID is not a number",
    });
    return;
  }
  
  let {title, completed} = req.body;
  completed = completed ? Boolean(completed) : undefined;

  const controller = new TaskController();
  const result = await controller.update(
    id,
    title,
    completed 
  );

  result.resolve(
    (response: string) => {
      res.status(200).json(response);
    },
    (error: AppError) => {
      const restError = translate_app_error_to_rest(error);
      res.status(restError.status).json(restError.message);
    }
  );
});
