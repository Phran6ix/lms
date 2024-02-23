import supertest from 'supertest'
import { RegisterUserPayload } from '../../validations/user.validation'
import { CreateUserModelObject, CreateUserObject, SeedUser, getCountry, getEmail, getFirstName, getGender, getLastname, getMiddleName, getPassword, getPhone, getState, getUserName } from '../../utils/tests/generate'
import { app } from '../../../server'
import { Server } from 'http'
import connectMongoose from '../../services/mongooseConnection'
import mongoose from 'mongoose'
import { DropCollection, InsertDocuments } from '../seeder'
import { User } from '../../application/entity/user'
import SMTPExpress from '../../services/smtpexpress'
import { IUser } from '../../application/interfaces/userInterface'

const userSignUpPayload: RegisterUserPayload = CreateUserObject()

describe("Authentication", () => {
    let server: Server
    let users: Omit<IUser, "id">
    beforeAll(async () => {
        await connectMongoose()
        server = app.listen(0)
        users = SeedUser()
        await InsertDocuments('users', [users])
    })



    jest.mock("../../services/smtpexpress", () => {
        return jest.fn().mockImplementation(() => {
            return {
                sendEmail: jest.fn()
            }
        })
    })
    describe("user sign up", () => {
        test("it should return 400 for invalid inputs", async () => {
            const { email, firstname, ...payload } = CreateUserObject()
            const response = await supertest(app).post("/v1/auth/register").set("content-Type", "application/json").send(payload)
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty("message")
        })

        test("it should return 201 for valid inputs ", async () => {
            const newUser = CreateUserObject()
            const response = await supertest(app).post("/v1/auth/register").set("content-Type", "application/json").send(newUser)
            // expect(SMTPExpress.prototype.sendEmail).toHaveBeenCalled()
            expect(response.status).toBe(201)
        })

        describe("Duplicate user", () => {
            test("it should return 400 if email already exists", async () => {
                const userObj = CreateUserObject({ email: users.email })
                const response = await supertest(app).post("/v1/auth/register").set("Content-Type", "application/json").send(userObj)

                expect(response.status).toBe(400)
                expect(response.body.message).toBe("User with credentials already exist")
            })

            test("it should return 400 if username already exists", async () => {
                const userObj = CreateUserObject({ username: users.userName })

                const response = await supertest(app).post("/v1/auth/register").set("Content-Type", "application/json").send(userObj)


                expect(response.status).toBe(400)
                expect(response.body.message).toBe("User with credentials already exist")
            })

        })

    })

    describe("user sign in", () => {
        const signInUrl = "/v1/auth/login"
        let seedUser: Omit<IUser, "id">
        beforeAll(async () => {
            seedUser = SeedUser()
            await InsertDocuments('users', [seedUser])
        })
        test("it should return a 400 for invalid email", async () => {
            const payload = { identifier: "incorrectemail@", password: "password" }

            const response = await supertest(app).post(signInUrl).set("Content-Type", "application/json").send(payload)

            expect(response.status).toBe(400)
        })

        test("it should return 404 if there is no input", async () => {
            const payload = {}

            const response = await supertest(app).post(signInUrl).set("Content-Type", "application/json").send({})
            expect(response.status).toBe(400)
        })

        test("it should return 400 if there is no username or email", async () => {
            const payload = {password: "password"}
            const response = await supertest(app).post(signInUrl).set("Content-Type","application/json").send(payload)

            expect(response.status).toBe(400)
        })
    })

    afterAll(async () => {

        await DropCollection('users')
        await mongoose.connection.close()
        server.close()
    })

})
