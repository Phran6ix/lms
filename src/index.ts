import express, { Response, Request, NextFunction } from 'express'
import cors from 'cors'
import config from './utils/config'
import globalErrorHandler from './utils/globalErrorHandler'
import connectMongoose from './services/mongooseConnection'
import { IUser } from './application/interfaces/userInterface'
import { User } from './application/entity/user'

declare global {
    namespace Express {
        export interface Request {
            user?: User
        }
    }
}
export default class ExpressApplication {
    constructor() {
        ExpressApplication.middleWares()
        ExpressApplication.startRoutes()
        ExpressApplication.errorHandler()

        ExpressApplication.startApp()
        connectMongoose()
    }

    private static app: express.Application = express()

    static startRoutes() {
        this.app.get("/api/health_check", (req: Request, res: Response) => {
            res.status(200).json({
                status: "Success",
                message: "API is live"
            })
        })
        // const router = new ApplicationRouter()
        // this.app.use("/api",
        //     router.callRoute(Methods.GET, [], '/health', TestCont, "sendH"))
        //

        this.app.use("*", (req: express.Request, res: express.Response) => {
            res.status(400).json({
                status: "Error",
                message: "Route not found"

            })
        })

    }

    static middleWares() {
        this.app.use(express.json())
        this.app.use(cors())
    }

    static errorHandler() {
        this.app.use(globalErrorHandler)
    }

    static startApp() {
        this.app.listen(config.PORT, () => {
            console.log(`Server has started on port ${config.PORT}`)
        })
    }

}
