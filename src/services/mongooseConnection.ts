import mongoose from "mongoose";
import config from "../utils/config";

const connectMongoose = function () {
    try {
      console.log(config.MONGO_URI)
         mongoose.connect(config.MONGO_URI).then(() => {
            console.log("MongoDb connection successful")
        })

    } catch (error) {
       console.error(error) 
        throw error
    }
}

export default connectMongoose
