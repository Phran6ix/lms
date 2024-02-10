import supertest from 'supertest'
import { RegisterUserPayload } from '../../validations/user.validation'
import { CreateUserModelObject, getCountry, getEmail, getFirstName, getGender, getLastname, getMiddleName, getPassword, getPhone, getState, getUserName } from '../../utils/tests/generate'
import { Gender } from '../../common/types'
import { app } from '../../../server'
import { Server } from 'http'
import connectMongoose from '../../services/mongooseConnection'
import mongoose from 'mongoose'
import { DropCollection, InsertDocuments } from '../seeder'
import { IUser } from '../../application/interfaces/userInterface'
import userModel from '../../application/database/userModel'
import { User } from '../../application/entity/user'

const userSignUpPayload: RegisterUserPayload = {
    firstname: getFirstName,
    lastname: getLastname,
    middlename: getMiddleName,
    password: getPassword,
    gender: Gender.F,
    country: getCountry,
    address: getState,
    age: 22,
    email: getEmail,
    username: getUserName,
    state: getState,
    phone_number: getPhone
}

describe("Authentication", () => {
    let server: Server
    beforeAll(async () => {
        await connectMongoose()
        server = app.listen(0)
        const users: Omit<User, "id"> = CreateUserModelObject()
        await InsertDocuments('User', [users])
    })
    describe("user sign up", () => {
        test("it should return 400 for invalid inputs", async () => {
            const { email, firstname, ...payload } = userSignUpPayload
            const response = await supertest(app).post("/v1/auth/register").set("content-Type", "application/json").send(payload)
            // console.log(response)
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty("message")
        })

        test("it should return 201 for valid inputs ", async () => {
            const response = await supertest(app).post("/v1/auth/register").set("content-Type", "application/json").send(userSignUpPayload)

            console.log(response.body)
            expect(response.status).toBe(201)
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
