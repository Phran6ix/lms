import supertest from "supertest";
import ExpressApplication from "../..";

describe("Application", () => {
    const app =ExpressApplication.getApp()
    test("It returns 200 if application is running", async () => {
        const response = await supertest(app).get("/api/health_check")

        console.log(response)
        expect(response.status).toBe(200)
    })
})
