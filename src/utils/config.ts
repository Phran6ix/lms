import { config } from "dotenv"
import Constant from "./constant"
config()
export default {
    PORT : process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || "LMS jwt secret",
    NODE_ENV : process.env.NODE_ENV || Constant.NODE_ENV.DEVELOPMENT
}
