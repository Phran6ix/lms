import supertest from 'supertest'
import { RegisterUserPayload } from '../../validations/user.validation'
import { CreateUserModelObject, CreateUserObject, getCountry, getEmail, getFirstName, getGender, getLastname, getMiddleName, getPassword, getPhone, getState, getUserName } from '../../utils/tests/generate'
import { Gender } from '../../common/types'
import { app } from '../../../server'
import { Server } from 'http'
import connectMongoose from '../../services/mongooseConnection'
import mongoose from 'mongoose'
import { DropCollection, InsertDocuments } from '../seeder'
import { IUser } from '../../application/interfaces/userInterface'
import userModel from '../../application/database/userModel'
import { User } from '../../application/entity/user'

const userSignUpPayload: RegisterUserPayload = CreateUserObject()

describe("Authentication", () => {
    let server: Server
    let users: Omit<User, "id">
    beforeAll(async () => {
        await connectMongoose()
        server = app.listen(0)
        users = CreateUserModelObject()
        await InsertDocuments('User', [users])
    })
    describe("user sign up", () => {
        test("it should return 400 for invalid inputs", async () => {
            const { email, firstname, ...payload } = userSignUpPayload
            const response = await supertest(app).post("/v1/auth/register").set("content-Type", "application/json").send(payload)
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty("message")
        })

        test("it should return 201 for valid inputs ", async () => {
            const response = await supertest(app).post("/v1/auth/register").set("content-Type", "application/json").send(userSignUpPayload)

            expect(response.status).toBe(201)
        })

        describe("Duplicate user", () => {
            test("it should return 400 if email already exists", async () => {
                const userObj = CreateUserObject({ email: users.email })
                const response = await supertest(app).post("/v1/auth/register").set("Content-Type", "application/json").send(userObj)

                expect(response.status).toBe(400)
                expect(response.body.message).toBe("User with email already exist")
            })

            test("it should return 400 if username already exists", async () => {
                const userObj = CreateUserObject({ username: users.username })
                
                const response = await supertest(app).post("/v1/auth/register").set("Content-Type", "application/json").send(userObj)

                expect(response.status).toBe(400)
                expect(response.body.message).toBe("User with email already exist")
            })
        })
    })

    describe("user sign in", () => {
        test("it should return a 400 for invalid email", async () => {
            const payload = { email: "incorrectemail", password: "password" }

            const response = await supertest(app).post("/v1/auth/login").set("Content-Type", "application/json").send(payload)
            expect(response.status).toBe(400)
        })
    })

    afterAll(async () => {
        await mongoose.connection.close()
        await DropCollection('User')
        server.close()
    })

});
