import MySQLConnection from "./database/mysql";

async function createDatabaseAndTable(): Promise<void> {
  const connection = new MySQLConnection({
    host: "localhost",
    user: "root",
    password: "Senha@597041",
  });

  try {
    await connection.execute("CREATE DATABASE IF NOT EXISTS todo");
    await connection.execute("USE todo");

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        PRIMARY KEY (id)
      )
    `);

    console.log("Banco de dados e tabela criados com sucesso!");
  } catch (error) {
    console.error("Erro ao criar o banco de dados e tabela:", error);
  }
}

createDatabaseAndTable();
