
import { z } from "zod";
import { objectIdSchema } from "../../utils/objectId";

const memberBodySchema = z.object({
    email: z.string().trim().toLowerCase().email("Invalid email address"),
    role: z.enum(["owner", "admin", "member", "viewer"])
}).strict()


const workspaceBodySchema = z.object({
    id: objectIdSchema
}).strict()

export const inviteMemberSchema = z.object({
    body: memberBodySchema
})

export const acceptInviteSchema = z.object({
    params: z.object({
        id: objectIdSchema
    })
})

export const declineInviteSchema = z.object({
    params: z.object({
        id: objectIdSchema
    })
})

export const setCurrentWorkplaceSchema =  z.object({
    body: workspaceBodySchema
})

export const removeMemberSchema = z.object({
    params: z.object({
        id: objectIdSchema
    })
})

export type MemberBody = z.infer<typeof memberBodySchema>
export type WorkspaceBody =  z.infer<typeof workspaceBodySchema>