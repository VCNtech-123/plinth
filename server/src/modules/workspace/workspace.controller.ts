import { Request, Response } from 'express'
import { getCurrentWorkspaceService, getWorkspaceMembersService, addWorkspaceMemberService } from './workspace.service'
import { ApiError } from '../../utils/ApiError'
import { MemberBody } from './workspace.validation'

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

    if (!members || members.length === 0) {
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

export const addWorkspaceMember = async (
    req: Request,
    res: Response
) => {
    
    const { body } = res.locals.validated as {
        body: MemberBody
    }

    const { email, role } = body

    const addedMember = await addWorkspaceMemberService(
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