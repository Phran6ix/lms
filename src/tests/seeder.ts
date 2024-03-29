import { Collection, Db, MongoClient } from "mongodb";
import config from "../utils/config";
async function connectMongo(): Promise<Db> {
    const client = new MongoClient(config.MONGO_URI_TEST)

    await client.connect()
    console.log("successfully connected to test mongo")
    const db = client.db("lms")
    return db
}

export async function InsertDocuments(collection: string, payload: any[]): Promise<unknown> {
    try {
        const db = await connectMongo()
        const col = db.collection(collection)
        const insertedDoc = await col.insertMany(payload)
        console.log("these are", insertedDoc)
        return insertedDoc
    } catch (error) {
        throw error
    }
}

export async function DropCollection(collection: string): Promise<void> {
    try {
        const db = await connectMongo()

        const col = db.collection(collection)
        await col.deleteMany()
    } catch (error) {
        throw error
    }
}

