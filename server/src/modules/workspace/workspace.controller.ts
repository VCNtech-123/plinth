import { Request, Response } from 'express'
import { getCurrentWorkspaceService, getWorkspaceMembersService, inviteUserService, getInvitesService, acceptInviteService, getUserWorkspacesService } from './workspace.service'
import { ApiError } from '../../utils/ApiError'
import { MemberBody } from './workspace.validation'
import { Workspace } from './workspace.model'

export const getCurrentWorkspace = async ( 
    req: Request,
    res: Response
) => {

    const result = await getCurrentWorkspaceService(
        req.user!._id,
        req.workspace!._id
    )

    if (!result) {
        throw new ApiError(404, "No workspace found")
    }

    const { workspace, membersCount, role } = result

    res.status(200).json({
        status: "success",
        data: {
            workspace: {
                id: workspace._id,
                name: workspace.name,
                createdBy: workspace.createdBy
            },
            role,
            membersCount
        }
    })
}

export const getWorkspaceMembers = async (
    req: Request,
    res: Response
) => {

    const members = await getWorkspaceMembersService(req.workspace!._id)

    if (!members) {
        throw new ApiError(404, "No members found")
    }

    res.status(200).json({
        status: "success",  
        data: members.map((member) => ({
            user: {
                id: member.user._id,
                name: member.user.name,
                email: member.user.email
            },
            role: member.role,
            joinedAt: member.joinedAt
        }))
    })
}

export const inviteUser = async (
    req: Request,
    res: Response
) => {
    
    const { body } = res.locals.validated as {
        body: MemberBody
    }

    const { email, role } = body

    const addedMember = await inviteUserService(
        req.workspace!._id,
        email,
        role,
        req.membership!
    )

    res.status(201).json({
        status: "success",
        message: "Member added successfully",
        data: {
            user: {
                id: addedMember.user._id,
                name: addedMember.user.name,
                email: addedMember.user.email
            },
            role: addedMember.role,
            joinedAt: addedMember.joinedAt
            }
        }
    )
}   

export const getInvites = async (
    req: Request,
    res: Response 
) => {

    const invites = await getInvitesService(req.user!._id);

    res.status(200).json({
        status: "success",
        data: invites.map((invite) => ({
                id: invite.workspace._id,
                name: invite.workspace.name,
                createdBy: invite.workspace.createdBy
        }))
    })
}

export const acceptInvite = async (
    req: Request,
    res: Response 
) => {

    const id = req.params.id as string
    const workspace = await acceptInviteService(id, req.user!._id);

    res.status(200).json({
        status: "success",
        data: {
            user: {
                id: workspace.user._id,
                name: workspace.user.name,
                email: workspace.user.email
            },
            role: workspace.role,
            joinedAt: workspace.joinedAt
            }
        }
    )
}

export const getUserWorkspaces = async (
    req: Request,
    res: Response
) => {

    const workspaces = await getUserWorkspacesService(req.user!._id)

    if (!workspaces) {
        throw new ApiError(404, "No workspaces found")
    }

    res.status(200).json({
        status: "success",
        data: workspaces.map((workspace) => ({
            id: workspace.workspace._id,
            name: workspace.workspace.name,
            createdBy: workspace.workspace.createdBy
        }))
    })
}