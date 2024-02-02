import supertest from "supertest";
import ExpressApplication from "../..";
import { Application } from "express";
import { app } from "../../../server";
import { Server } from "http";
import mongoose from "mongoose";
import connectMongoose from "../../services/mongooseConnection";

describe("Application", () => {
    // let app: Application
    let server: Server
    beforeAll(async () => {
        await connectMongoose()
        server = app.listen(0)
        return { server }
    })
    test("It returns 200 if application is running", async () => {
        console.log("test 1")
        const response = await supertest(app).get("/api/health_check")

        console.log(response.status)
        expect(response.status).toBe(200)
    })

    afterAll(async () => {
        await mongoose.connection.close()
        server.close()
    })
})
