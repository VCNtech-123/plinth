import { Request, Response } from 'express'
import { getCurrentWorkspaceService } from './workspace.service'
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