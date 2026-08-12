
import { Request, Response, NextFunction } from "express"
import { WorkspaceRole } from "../modules/workspace/workspaceMember.model"
import { ApiError } from "../utils/ApiError"

export const authorize = (...allowedRoles: WorkspaceRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.membership?.role

        if (!userRole) {
            throw new ApiError(401, "Authentication required")
        }

        if (!allowedRoles.includes(userRole)) {
            throw new ApiError(403, "Insufficient permissions")
        }

        next()
    }
}