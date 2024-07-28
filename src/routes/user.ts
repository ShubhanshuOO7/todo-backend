import { PrismaClient } from "@prisma/client/extension";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { signupInput,signinInput } from "@shubhanshu5320/common2"

 export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: String;
    JWT_SECRET: string;
  };
}>();
userRouter.post("/signup", async (c) => {
    const body = await c.req.json();
    const {success} = signupInput.safeParse(body)
    if(!success){
      c.status(411);
      c.json({
        message: "Inputs not correct"
      })
    }
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
      const user = await prisma.user.create({
        data: {
          username: body.username,
          password: body.password,
          name: body.name,
        },
      });
      const jwt = await sign(
        {
          id: user.id,
        },
        c.env.JWT_SECRET
      );
      return c.text(jwt);
    } catch (e) {
      console.log(e);
      c.status(411);
      return c.json({
        message: "Invalid",
      });
    }
  });
  
  userRouter.post("/signin", async (c) => {
    const body = await c.req.json();
    const {success} = signinInput.safeParse(body);
    if(!success){
      c.status(411)
      return c.json({
        message: "Inputs not correct"
      })

    }
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
      const user = await prisma.user.findFirst({
        where: {
          email: body.email,
          password: body.password,
        },
      });
      if (!user) {
        return c.json({
          message: "Incorrect creds",
        });
      }
      const jwt = await sign(
        {
          id: user.id,
        },
        c.env.JWT_SECRET
      );
      return c.text(jwt)
    } catch (e) {
      console.log(e);
      c.status(411);
      return c.text("Invalid");
    }
  });
  
  export default userRouter;
  