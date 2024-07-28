import z  from "zod"
export const signupInput = z.object({
    username: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional()
})
export type SignupInput = z.infer<typeof signupInput>

export const signinInput = z.object({
    username: z.string().email(),
    password: z.string().min(6)
})
export type SigninInput = z.infer<typeof signinInput>

export const createtodoInput = z.object({
    title: z.string(),
    content: z.string()
})
export type CreateTodoInput = z.infer<typeof createtodoInput>

export const updatetodoInput = z.object({
    title: z.string(),
    content: z.string(),
    id: z.number()
})
export type UpdateTodoInput = z.infer<typeof updatetodoInput>