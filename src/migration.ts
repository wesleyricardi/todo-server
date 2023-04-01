import MySQLPool from "./database/mysql";
import * as dotenv from "dotenv";

dotenv.config();

if (
  !process.env.MYSQL_HOST ||
  !process.env.MYSQL_USER ||
  !process.env.MYSQL_PASS ||
  !process.env.TODO_DATABASE_NAME
) {
  if (!process.env.MYSQL_HOST)
    console.log("environment variable MYSQL_HOST its not set");
  if (!process.env.MYSQL_USER)
    console.log("environment variable MYSQL_USER its not set");
  if (!process.env.MYSQL_PASS)
    console.log("environment variable MYSQL_PASS its not set");
  if (!process.env.TODO_DATABASE_NAME)
    console.log("environment variable TODO_DATABASE_NAME its not set");
  process.exit(1);
}

const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASS = process.env.MYSQL_PASS;
const TODO_DATABASE_NAME = process.env.TODO_DATABASE_NAME;

async function createDatabaseAndTable(): Promise<void> {
  const pool = new MySQLPool({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASS,
  });

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    connection.query("CREATE DATABASE IF NOT EXISTS " + TODO_DATABASE_NAME);
    connection.query("USE " + TODO_DATABASE_NAME);
    connection.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        PRIMARY KEY (id)
      )
    `);
    await connection.commit();
    connection.release();
    console.log("Banco de dados e tabela criados com sucesso!");
  } catch (error) {
    console.error("Erro ao criar o banco de dados e tabela:", error);
  }
}

createDatabaseAndTable().finally(() => process.exit(1));
