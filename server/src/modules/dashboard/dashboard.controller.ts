
import { Request, Response } from "express";
import { getDashboardService } from "./dashboard.service";
import { ApiError } from "../../utils/ApiError";

export const getDashboard = async (
    req: Request,
    res: Response
) => {

    const stats = await getDashboardService(
        req.workspace!._id
    )

    if (!stats) {
       throw new ApiError(404, "Dashboard metrics for the specified user could not be found.")
    }

    res.status(200).json({
        status: "success",
        data: stats
    });
}