import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { StatsService } from "./stats.service";
import { sendResponse } from "../../utils/sendResponse";

const getParcelStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await StatsService.getParcelStats();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Parcel stats fetched successfully",
    data: stats,
  });
});

export const StatsController = {
  getParcelStats,
};
