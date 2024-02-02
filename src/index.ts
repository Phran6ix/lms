import express, { Response, Request, NextFunction, Application } from 'express'
import cors from 'cors'
import config from './utils/config'
import globalErrorHandler from './utils/globalErrorHandler'
import connectMongoose from './services/mongooseConnection'
import { IUser } from './application/interfaces/userInterface'
import { User } from './application/entity/user'
import UserRoute from './application/routes/user.routes'
// import route from './application/routes/'

declare global {
    namespace Express {
        export interface Request {
            user?: User
            userId: string
        }
    }
}
export default class ExpressApplication {
    constructor() {
        this.middleWares()
        this.startRoutes()
        this.errorHandler()
        // connectMongoose()

        // this.startApp()
    }

    // get getApp(): Application {
    //     return this.app
    // }
    public getApp(): Application {
        return this.app
    }
    private app: express.Application = express()

    startRoutes() {
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
        this.app.use("/v1", UserRoute)
        this.app.use("*", (req: express.Request, res: express.Response) => {
            res.status(400).json({
                status: "Error",
                message: "Route not found"

            })
        })

    }

    middleWares() {
        this.app.use(express.json())
        this.app.use(cors())
    }

    errorHandler() {
        this.app.use(globalErrorHandler)
    }

    startApp() {
        connectMongoose().then(() => {
            this.app.listen(config.PORT, () => {
                console.log(`Server has started on port ${config.PORT}`)
            })
        })
    }

}
