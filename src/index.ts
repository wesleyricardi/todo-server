import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

import { routes } from "./routes";
app.use("/", routes);

app.listen(3000, () => {
  console.log("server listening on port 3000");
});
