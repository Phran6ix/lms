import supertest from "supertest";
import ExpressApplication from "../..";
import { Application } from "express";
import { app } from "../../../server";
import { Server } from "http";

describe("Application", () => {
    // let app: Application
    let server: Server
    beforeAll(() => {
        server = app.listen(0)
        return { server }
    })
    test("It returns 200 if application is running", async () => {
        const response = await supertest(app).get("/api/health_check")

        console.log(response.status)
        expect(response.status).toBe(200)
    })

    afterAll(() => {
        server.close()
    })
})
