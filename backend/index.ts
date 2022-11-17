import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { PrismaClient } from "@prisma/client";

import { user, transaction, account } from "./routes";

const prisma = new PrismaClient();

prisma
  .$connect()
  .then(() => {
    const app: Application = express();

    app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
      })
    );
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use("/api/v1/user", user);
    app.use("/api/v1/transaction", transaction);
    app.use("/api/v1/account", account);

    const port = process.env.PORT || 8030;

    app.listen(port, () =>
      console.log(`The server is running on the port ${port}`)
    );
  })
  .catch(() => console.log("DB offline."));
