import ExpressApplication from "./src";
import dotenv from 'dotenv'
dotenv.config()

ExpressApplication.middleWares()
ExpressApplication.startRoutes()
ExpressApplication.middleWares()

ExpressApplication.startApp()

