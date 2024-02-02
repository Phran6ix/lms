import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import config from "../utils/config";

const connectMongoose = async function() {
   try {
      console.log("W a re in this env", config.NODE_ENV)

      let url: string
      if (config.NODE_ENV == 'test') {
         const mongoServer = await MongoMemoryServer.create()
         url = mongoServer.getUri()
      
      } else {
         url = config.MONGO_URI
      }
      mongoose.connect(url).then(() => {
         console.log("MongoDb connection successful")
      })

   } catch (error) {
      console.error(error)
      throw error
   }
}

export default connectMongoose
