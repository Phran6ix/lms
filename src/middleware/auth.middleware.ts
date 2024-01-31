import { NextFunction, Request } from "express";
import { IUserRepo, UserRepository } from "../application/repository/user.repository";
import HTTPException from "../utils/exception";
import Helper from "../utils/helper";
import { UserMapper } from "../application/mapper/user";

class AppMiddleware {
    private readonly userRepo: IUserRepo

    constructor(userRepo: IUserRepo) {
        this.userRepo = userRepo
    }

    public async AuthorizedRoute(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.headers.authorization) {
                return next(new HTTPException("You are not logged in", 401))
            }

            const token = req.headers.authorization.split(" ")[1]
            if (!token) {
                return next(new HTTPException("Invalid token", 401))
            }

            const payload = Helper.verifyJWT({ token })
            if (!payload) {
                return next(new HTTPException("Invalid or expired token", 401))
            }

            req.userId = payload.id
            return next()
        } catch (error) {
            next(error)
        }
    }
}

export default AppMiddleware
