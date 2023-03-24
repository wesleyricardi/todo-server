import express from "express";
import { Request, Response } from "express";
import TaskController from "./controller/todo_controller";

const app = express();
app.use(express.json());

app.get("/get_all_tasks", (req: Request, res: Response) => {
  const controller = new TaskController();

  try {
    const response = controller.getAllTaks();

    res.status(201).send(JSON.stringify(response));
  } catch {
    res.status(500).send(
      JSON.stringify({
        message: "Something went wrong",
      })
    );
  }
});

app.post("/add_task", (req: Request, res: Response) => {
  //TODO: SANITIZE REQUEST
  console.log(req.body);
  if (!req.body?.title) {
    res.sendStatus(400).send(
      JSON.stringify({
        message: "Its missing title on body",
      })
    );
    return;
  }
  const { body } = req;

  const controller = new TaskController();

  try {
    const response = controller.addTodo(body.title as string);

    res.status(201).send(JSON.stringify(response));
  } catch {
    res.status(500).send(
      JSON.stringify({
        message: "Something went wrong",
      })
    );
  }
});

app.delete("/delete_task", (req: Request, res: Response) => {
  //TODO: SANITIZE REQUEST
  if (!req.query.id) {
    res.sendStatus(400).send(
      JSON.stringify({
        message: "Its missing ID on query",
      })
    );
    return;
  }
  const id = parseInt(req.query.id as string);

  if (isNaN(id)) {
    res.sendStatus(400).send(
      JSON.stringify({
        message: "ID is not a number",
      })
    );
    return;
  }

  const controller = new TaskController();

  try {
    const response = controller.deleteTodoById(id);

    res.status(200).send(JSON.stringify(response));
  } catch {
    res.status(500).send(
      JSON.stringify({
        message: "Something went wrong",
      })
    );
  }
});

app.put("/mark_task_as_completed", (req: Request, res: Response) => {
  //TODO: SANITIZE REQUEST
  if (!req.query.id) {
    res.sendStatus(400).send(
      JSON.stringify({
        message: "Its missing ID on query",
      })
    );
    return;
  }
  const id = parseInt(req.query.id as string);

  if (isNaN(id)) {
    res.sendStatus(400).send(
      JSON.stringify({
        message: "ID is not a number",
      })
    );
    return;
  }

  const controller = new TaskController();

  try {
    const response = controller.markTodoAsCompleted(id);

    res.status(200).send(JSON.stringify(response));
  } catch {
    res.status(500).send(
      JSON.stringify({
        message: "Something went wrong",
      })
    );
  }
});

app.listen(3000, () => {
  console.log("server listening on port 3000");
});
