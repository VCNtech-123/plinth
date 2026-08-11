import { Request, Response } from 'express'
import { getCurrentWorkspaceService, getWorkspaceMembersService } from './workspace.service'
import { ApiError } from '../../utils/ApiError'

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