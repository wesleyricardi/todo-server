import mysql, {
  OkPacket,
  Pool,
  QueryError,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";
import { AppError, CodeError } from "../error/error";
import { Err, Ok, Result } from "../lib/ErrorHandler";

export type QueryReturn =
  | RowDataPacket[]
  | RowDataPacket[][]
  | OkPacket
  | OkPacket[]
  | ResultSetHeader;

export abstract class Database {
  abstract query<T = QueryReturn>(
    sql: string,
    values?: (string | number | boolean)[]
  ): Promise<Result<T, AppError>>;
  abstract execute<T = QueryReturn>(
    sql: string,
    values?: (string | number | boolean)[]
  ): Promise<Result<T, AppError>>;
}

class MySQLPool implements Database {
  private pool: Pool;

  constructor(config: mysql.PoolOptions) {
    this.pool = mysql.createPool(config);
  }

  async getConnection() {
    return await this.pool.getConnection();
  }

  async query<T = QueryReturn>(
    sql: string,
    values?: (string | number | boolean)[]
  ): Promise<Result<T, AppError>> {
    const { error, success } = await this.pool
      .query(sql, values)
      .then((response) => {
        return { success: response[0], error: null };
      })
      .catch((error: QueryError) => {
        return { error: error, success: null };
      });

    if (error || !success) {
      switch (error.code) {
        case "ER_ACCESS_DENIED_ERROR":
          return Err(
            new AppError(
              "Access to mysql denied",
              CodeError.INTERNAL_ERROR,
              "database"
            )
          );
        case "ER_DBACCESS_DENIED_ERROR":
          return Err(
            new AppError(
              "Access to database denied",
              CodeError.INTERNAL_ERROR,
              "database"
            )
          );
        case "ER_BAD_DB_ERROR":
          return Err(
            new AppError(
              "Unknown database",
              CodeError.INTERNAL_ERROR,
              "database"
            )
          );
        case "ER_PARSE_ERROR":
          return Err(
            new AppError(
              "SQL syntax error",
              CodeError.INTERNAL_ERROR,
              "database"
            )
          );
        case "ER_NO_SUCH_TABLE":
          return Err(
            new AppError(
              "Table does not exist",
              CodeError.INTERNAL_ERROR,
              "database"
            )
          );
        case "ER_DUP_ENTRY":
          return Err(
            new AppError(
              "Duplicate entry for unique key",
              CodeError.INTERNAL_ERROR,
              "database"
            )
          );
        case "ER_BAD_FIELD_ERROR":
          return Err(
            new AppError(
              "Unknown column in field list",
              CodeError.INTERNAL_ERROR,
              "database"
            )
          );
        case "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD":
          return Err(
            new AppError(
              "Data truncated for column",
              CodeError.INTERNAL_ERROR,
              "database"
            )
          );
        case "ER_DATA_TOO_LONG":
          return Err(
            new AppError(
              "Data too long for column",
              CodeError.INTERNAL_ERROR,
              "database"
            )
          );
        case "ER_SERVER_GONE_ERROR":
          return Err(
            new AppError(
              "MySQL server has gone away",
              CodeError.INTERNAL_ERROR,
              "database"
            )
          );
        default:
          return Err(
            new AppError(
              "Database error:" + error.message,
              CodeError.UNEXPECTED,
              "database"
            )
          );
      }
    }

    return Ok(success as unknown as T);
  }

  async execute<T = QueryReturn>(
    sql: string,
    values?: (string | number | boolean)[]
  ): Promise<Result<T, AppError>> {
    const { error, success } = await this.pool
      .execute(sql, values)
      .then((response) => {
        return { success: response[0], error: null };
      })
      .catch((error: QueryError) => {
        return { error: error, success: null };
      });

    if (error || !success) {
      switch (error.code) {
        case "ER_ACCESS_DENIED_ERROR":
          return Err(
            new AppError(
              "Access to mysql denied",
              CodeError.INTERNAL_ERROR,
              "database"
            )
          );
        case "ER_DBACCESS_DENIED_ERROR":
          return Err(
            new AppError(
              "Access to database denied",
              CodeError.INTERNAL_ERROR,
              "database"
            )
          );
        case "ER_BAD_DB_ERROR":
          return Err(
            new AppError(
              "Unknown database",
              CodeError.INTERNAL_ERROR,
              "database"
            )
          );
        case "ER_PARSE_ERROR":
          return Err(
            new AppError(
              "SQL syntax error",
              CodeError.INTERNAL_ERROR,
              "database"
            )
          );
        case "ER_NO_SUCH_TABLE":
          return Err(
            new AppError(
              "Table does not exist",
              CodeError.INTERNAL_ERROR,
              "database"
            )
          );
        case "ER_DUP_ENTRY":
          return Err(
            new AppError(
              "Duplicate entry for unique key",
              CodeError.INTERNAL_ERROR,
              "database"
            )
          );
        case "ER_BAD_FIELD_ERROR":
          return Err(
            new AppError(
              "Unknown column in field list",
              CodeError.INTERNAL_ERROR,
              "database"
            )
          );
        case "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD":
          return Err(
            new AppError(
              "Data truncated for column",
              CodeError.INTERNAL_ERROR,
              "database"
            )
          );
        case "ER_DATA_TOO_LONG":
          return Err(
            new AppError(
              "Data too long for column",
              CodeError.INTERNAL_ERROR,
              "database"
            )
          );
        case "ER_SERVER_GONE_ERROR":
          return Err(
            new AppError(
              "MySQL server has gone away",
              CodeError.INTERNAL_ERROR,
              "database"
            )
          );
        default:
          return Err(
            new AppError(
              "Database error:" + error.message,
              CodeError.UNEXPECTED,
              "database"
            )
          );
      }
    }

    return Ok(success as unknown as T);
  }
}

export default MySQLPool;
