
import { z } from "zod";
import { objectIdSchema } from "../../utils/objectId";

const memberBodySchema = z.object({
    email: z.string().trim().toLowerCase().email("Invalid email address"),
    role: z.enum(["owner", "admin", "member", "viewer"])
}).strict()

export type MemberBody = z.infer<typeof memberBodySchema>

export const addWorkspaceMemberSchema = z.object({
    body: memberBodySchema
})

export const acceptInviteSchema = z.object({
    params: objectIdSchema
})