import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client/extension";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { userRouter } from "./routes/user"
import { todoRouter } from "./routes/todo";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: String;
    JWT_SECRET: string;
  };
}>();

app.route("/api/v1/user",userRouter)
app.route("/api/v1/todo",todoRouter)

