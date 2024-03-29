import ExpressApplication from "./src";
import dotenv from 'dotenv'
import Constant from "./src/utils/constant";
dotenv.config()
//
// ExpressApplication.middleWares()
// ExpressApplication.startRoutes()
// ExpressApplication.middleWares()
//
//
const server = new ExpressApplication()

export const app = server.getApp()
if (process.env.NODE_ENV != Constant.NODE_ENV['TESTING']) {
  server.startApp()
}
