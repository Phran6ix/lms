import express ,{Response, Request} from 'express'
import config from './utils/config'
import globalErrorHandler from './utils/globalErrorHandler'

export default class ExpressApplication {
    private static app: express.Application = express()

    //declare route
    //
    //handle exception
    
    static startRoutes () {
        this.app.get("/api/health_check", (req:Request, res:Response) => {
            res.status(200).json({
                status: "Success",
                message:"API is live"
            })
        })

        this.app.use("*", (req:express.Request, res: express.Response) => {
            res.status(400).json({
                status: "Error",
                message: "Route not found"

            })
        })
    }

    static middleWares() {
        this.app.use(express.json())
    }

    static errorHandler () {
        this.app.use(globalErrorHandler)
    }

    static startApp () {
        this.app.listen(config.PORT, () => {
            console.log(process.env.PORT)
            console.log(`Server has started on port ${config.PORT}`)
        })
    }

}
