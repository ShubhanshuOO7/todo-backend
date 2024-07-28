import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client/extension";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import {createtodoInput,updatetodoInput} from "@shubhanshu5320/common2"


export const todoRouter = new Hono<{
    Bindings:{
        DATABASE_URL: String,
        JWT_SECRET: string
    },
    variables:{
        userId : string
    }
}>()

todoRouter.use("/*",async(c,next)=>{
    const authHeader = c.req.header("authorization") || "";
    
    try{
        const user = await verify(authHeader,c.env.JWT_SECRET)
        if(user){
            //@ts-ignore
            c.set("userId", user.id as string)
            await next()
        }else{
            c.status(403)
            return c.json({
                message: "you are not logged in"
            })
        }
    }catch(e){
        console.log(e)
        c.status(403)
        return c.json({
            message: "you are not logged in"
        })
    }
})
todoRouter.post("/",async(c)=>{
    const body = await c.req.json()
    const {success} = createtodoInput.safeParse(body)
    if(!success){
        c.status(411)
        return c.json({
            message:"Inputs not correct"
        })
    }
    //@ts-ignore
    const authorId = c.get("userId");
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    })
  const todo = await prisma.todo.create({
      data:{
        title: body.title,
        content: body.content,
        AuthorId: authorId
      }
  })
  return c.json({
    id: todo.id
  })
})
todoRouter.put("/", async(c)=>{
    const body = await c.req.json()
    const {success} = updatetodoInput.safeParse(body)
    if(!success){
        c.status(411)
        return c.json({
            message: "Inputs not correct"
        })
    }
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const todo = await prisma.todo.update({
        where:{
            id : body.id
        },
        data:{
            title: body.title,
            content: body.content
        }
    })
    return c.json({
        message: todo.id
    })
})
todoRouter.get("/bulk",async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const blogs = await prisma.blog.findMany({
        select: {
            title: true,
            content: true,
            id: true
        }
    })
    return c.json({
        blogs
    })
})
todoRouter.get("/:id",async(c)=>{
    const id = c.req.param("id")
    const prisma = new PrismaClient({
        datasourecUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    
    try {
        const blog = await prisma.blog.findFirst({
            where:{
                id : Number(id)
            },
            select:{
               title: true,
               content: true,
               completed: true

            }
        })
        return c.json({
            blog
        })
    } catch (e) {
        c.status(411);
        return c.json({
              message: "Error While fetching blog post"
        });
    }

})