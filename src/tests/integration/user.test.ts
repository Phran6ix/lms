import supertest from 'supertest'
import ExpressApplication from '../..'
import { RegisterUserPayload } from '../../validations/user.validation'
import { getCountry, getEmail, getFirstName, getGender, getLastname, getMiddleName, getPassword, getState, getUserName } from '../../utils/tests/generate'
import { Gender } from '../../common/types'


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
    state: getState
}

describe("Authentication", () => {
    const app = ExpressApplication.getApp()
    describe("user sign up", () => {
        test("it should return 400 for invalid inputs", async () => {
            const { email, firstname, ...payload } = userSignUpPayload
            const response = await supertest(app).post("/v1/auth/register").set("content-Type", "application/json").send(payload)
            // console.log(response)
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty("message")
        })
    })
})
