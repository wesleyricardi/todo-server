import { Ok, Err, Result } from "../utils/ErrorHandler.js";
import { AppError, CodeError } from "../error/error.js";
import { Task } from "../entities/task.js";
import { prisma as prismaGlobal } from "../infra/prisma/index.js";
import { Prisma, PrismaClient } from "@prisma/client";

type PrismaType = PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation>

export abstract class BaseRepository {
  prisma: PrismaType;

  constructor(database: PrismaType) {
    this.prisma = database;
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

export class TaskRepository extends BaseRepository {
  constructor(
    prisma:PrismaType = prismaGlobal
  ) {
    super(prisma);
  }

  async store(title: string): Promise<Result<Task, AppError>> {
    try {
      const task = await this.prisma.todo.create({
        data: {
          title,
        }
      })
      return Ok(task);
    } catch (e) {
      console.log(e)
      return Err(new AppError("create task failed", CodeError.INTERNAL_ERROR, "database"))
    }
  }
  async getAll(): Promise<Result<Task[], AppError>> {
    try {
      const tasks = await this.prisma.todo.findMany();

      if (tasks.length < 1)
        return Err(
          new AppError("not found any tasks", CodeError.NOT_FOUND, "database")
        );

      return Ok(tasks);
    } catch (e) {
      console.log(e)
      return Err(new AppError("get all task fail", CodeError.INTERNAL_ERROR, "database"))
    }
  }

  async get(id: number): Promise<Result<Task, AppError>> {
    try {
      const task = await this.prisma.todo.findUnique({
        where: {
          id
        }
      })

      if(!task) return Err(
        new AppError("task not found", CodeError.NOT_FOUND, "database")
      );

      return Ok(task);

    } catch (e) {
      console.log(e)
      return Err(new AppError("get task fail", CodeError.INTERNAL_ERROR, "database"))
    }
  }

  async delete(id: number): Promise<Result<number, AppError>> {
    try {
      await this.prisma.todo.delete({
        where: {
          id
        }
      })

      return Ok(1);
    } catch (e) {
      if(e.code === 'P2025') return Err(
        new AppError("task not found", CodeError.NOT_FOUND, "database")
      );

      console.log(e)
      return Err(new AppError("delete task fail", CodeError.INTERNAL_ERROR, "database"))
    }
  }

  async storeUpdate(
    id: number,
    title?: string,
    completed?: boolean
  ): Promise<Result<number, AppError>> {
    try {
      let dataToUpdate: {title?:string, completed?:boolean} = {title, completed}
      if(title === undefined) {
        const {title:_, ...dataToUpdateWithoutTitle} = dataToUpdate;
        dataToUpdate = dataToUpdateWithoutTitle;
      }
      if(completed === undefined) {
        const {completed:_, ...dataToUpdateWithoutCompleted} = dataToUpdate;
        dataToUpdate = dataToUpdateWithoutCompleted
      }

      await this.prisma.todo.update({
        where: {
          id
        },
        data: dataToUpdate
      })

      return Ok(1);
    } catch (e) {
      if(e.code === 'P2025') return Err(
        new AppError("task not found", CodeError.NOT_FOUND, "database")
      );
      
      console.log(e)
      return Err(new AppError("update task fail", CodeError.INTERNAL_ERROR, "database"))
    }
  }
}
