import { ResultSetHeader } from "mysql2";
import { Ok, Err, Result } from "../utils/ErrorHandler.js";
import MySQLPool, { Database } from "../database/mysql.js";
import { AppError, CodeError } from "../error/error.js";
import { Task } from "../entities/task.js";

export abstract class BaseRepository {
  database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  abstract store(title: string): Promise<Result<Task, AppError>>;

  abstract getAll(): Promise<Result<Task[], AppError>>;

  abstract get(id: number): Promise<Result<Task, AppError>>;

  abstract delete(id: number): Promise<Result<number, AppError>>;

  abstract storeUpdate(
    id: number,
    title?: string,
    completed?: boolean
  ): Promise<Result<number, AppError>>;
}

const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASS = process.env.MYSQL_PASS;
const TODO_DATABASE_NAME = process.env.TODO_DATABASE_NAME;

export class TaskRepository extends BaseRepository {
  constructor(
    database: Database = new MySQLPool({
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PASS,
      database: TODO_DATABASE_NAME,
    })
  ) {
    super(database);
  }

  async store(title: string): Promise<Result<Task, AppError>> {
    const result = await this.database.query<ResultSetHeader>(
      "INSERT INTO tasks (title, completed) VALUES (?, ?)",
      [title, false]
    );

    if (result.error) return Err(result.error);
    const { insertId } = result.success_or_throw;

    return Ok({
      id: insertId,
      title,
      completed: false,
    });
  }
  async getAll(): Promise<Result<Task[], AppError>> {
    const result = await this.database.query<Task[]>("SELECT * FROM tasks");

    if (result.error) return Err(result.error);
    const tasks = result.success_or_throw;

    if (tasks.length < 1)
      return Err(
        new AppError("not found any tasks", CodeError.NOT_FOUND, "model")
      );

    return Ok(tasks);
  }

  async get(id: number): Promise<Result<Task, AppError>> {
    const result = await this.database.query<Task[]>(
      "SELECT * FROM tasks WHERE id = ?",
      [id]
    );

    if (result.error) return Err(result.error);
    if (!result.success_or_throw.length)
      return Err(
        new AppError(
          "Not found any task with id " + id,
          CodeError.NOT_FOUND,
          "repository"
        )
      );

    const task = result.success_or_throw[0];

    return Ok(task);
  }

  async delete(id: number): Promise<Result<number, AppError>> {
    const result = await this.database.query<ResultSetHeader>(
      "DELETE FROM tasks WHERE id = ?",
      [id]
    );

    if (result.error) return Err(result.error);
    const { affectedRows } = result.success_or_throw;
    if (!affectedRows)
      return Err(
        new AppError("Delete task failed", CodeError.NOT_FOUND, "repository")
      );

    return Ok(1);
  }

  async storeUpdate(
    id: number,
    title?: string,
    completed?: boolean
  ): Promise<Result<number, AppError>> {
    if (!title === undefined && completed === undefined)
      return Err(
        new AppError(
          "title and completed are empty",
          CodeError.BAD_REQUEST,
          "repository"
        )
      );

    const titleQuery = title !== undefined ? " title = ?" : "";
    const completedQuery =
      completed !== undefined
        ? title !== undefined
          ? ", completed = ?"
          : " completed = ?"
        : "";

    const query =
      "UPDATE tasks SET" + titleQuery + completedQuery + " WHERE id = ?";

    const queryArray = [];
    if (title !== undefined) queryArray.push(title);
    if (completed !== undefined) queryArray.push(completed);
    queryArray.push(id);

    const result = await this.database.query<ResultSetHeader>(
      query,
      queryArray
    );

    if (result.error) return Err(result.error);
    const { affectedRows } = result.success_or_throw;
    if (!affectedRows)
      return Err(
        new AppError("Update task failed", CodeError.NOT_FOUND, "repository")
      );

    return Ok(1);
  }
}
