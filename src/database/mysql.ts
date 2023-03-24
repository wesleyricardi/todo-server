import mysql, { Pool } from "mysql";

class MySQLConnection {
  private pool: Pool;

  constructor(config: mysql.PoolConfig) {
    this.pool = mysql.createPool(config);
  }

  query<T>(sql: string, values?: any): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results as T[]);
        }
      });
    });
  }

  execute(
    sql: string,
    values?: any
  ): Promise<mysql.OkPacket | mysql.OkPacket[]> {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
}

export default MySQLConnection;
