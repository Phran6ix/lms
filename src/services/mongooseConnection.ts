import mongoose from "mongoose";
import config from "../utils/config";

const connectMongoose = async function() {
   try {

      let url: string
      if (config.NODE_ENV == 'test') {
         url = config.MONGO_URI_TEST

      } else {
         url = config.MONGO_URI
      }
      await mongoose.connect(url)
      console.log("MongoDB connection is successful")
   } catch (error) {
      console.error(error)
      throw error
   }
}

export default connectMongoose
