import { NextFunction, Request, Response } from "express";
import HTTPException from "../utils/exception";
import globalErrorHandler from "../utils/globalErrorHandler";
import { ResponseType } from "./responseType";

export default abstract class BaseController {
    protected req: Request;
    protected res: Response;
    protected next: NextFunction;

    constructor(req:Request, res:Response, next: NextFunction) {
        this.req = req;
        this.res = res;
        this.next = next;
    }

    sendResponse (data: ResponseType):Response {
        return this.res.status(data['code']).json({
            message: data.message,
            data: data.data
        })
    }

    sendErrorResponse(error: unknown):Response {
        console.log("Send Error Response")
        return globalErrorHandler(error as HTTPException, this.req, this.res)
    }
}
