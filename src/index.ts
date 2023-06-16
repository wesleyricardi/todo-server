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

import express from "express";
import cors from "cors";
import { routes } from "./routes/index.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", routes);

app.listen(3000, () => {
  console.log("server listening on port 3000");
});

export default app;