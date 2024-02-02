import { config } from "dotenv"
import Constant from "./constant"
config()
export default {
    PORT : process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || "LMS jwt secret",
    NODE_ENV : process.env.NODE_ENV || Constant.NODE_ENV.DEVELOPMENT,
    MONGO_URI: process.env.MONGO_URI as string || "mongodb://127.0.0.1:27017/my_lms",
    MONGO_URI_TEST: process.env.MONGO_URI_TEST as string || "mongodb://127.0.0.1:27017/my_lms",

    SMTP_EXPRESS_KEY: process.env.SMTP_EXPRESS_KEY as string,
    SMTP_EXPRESS_SECRET: process.env.SMTP_EXPRESS_SECRET as string,
}
