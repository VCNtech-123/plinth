
import { z } from "zod";
import { objectIdSchema } from "../../utils/objectId";

const memberBodySchema = z.object({
    email: z.string().trim().toLowerCase().email("Invalid email address"),
    role: z.enum(["owner", "admin", "member", "viewer"])
}).strict()

const workspaceNameSchema = z.object({
    name: z.string()
      .trim()
      .min(2, "Workspace name must be at least 2 characters")
      .max(60, "Workspace name must be at most 60 characters"),
  }).strict()

const workspaceBodySchema = z.object({
    id: objectIdSchema
}).strict()

const workspaceUpdateBodySchema = z.object({
    name: z.string().trim().min(1, "Workspace name required")
})

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

export const updateWorkspaceSchema = z.object({
    body: workspaceUpdateBodySchema
})

export const createWorkspaceSchema = z.object({
    body: workspaceNameSchema
})

export type MemberBody = z.infer<typeof memberBodySchema>
export type WorkspaceBody =  z.infer<typeof workspaceBodySchema>
export type WorkspaceUpdateBody = z.infer<typeof workspaceUpdateBodySchema>
export type WorkspaceNameBody = z.infer<typeof workspaceNameSchema>