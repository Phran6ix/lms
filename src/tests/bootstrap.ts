// import { MongoMemoryServer } from "mongodb-memory-server";
// import mongoose from "mongoose";
//
// let mongoServer: MongoMemoryServer
// beforeAll( async () => {
//     mongoServer = await MongoMemoryServer.create()
//
//     const url = mongoServer.getUri()
//     console.log(url)
//     await mongoose.connect(url)
// })

import { app } from "../../server"

//
afterAll ( () => {
    process.exit(1)
})
//
// afterEach(async () => {
//     const collections = mongoose.connection.collections
//
//     for (let key in collections) {
//         const collection = collections[key]
//         await collection.deleteMany()
//
//     }
// })
