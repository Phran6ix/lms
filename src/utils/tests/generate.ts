import { faker } from "@faker-js/faker";
import { IUser } from "../../application/interfaces/userInterface";
import { RegisterUserPayload } from "../../validations/user.validation";
import { Gender } from "../../common/types";
import { User } from "../../application/entity/user";

export const getFirstName = faker.person.firstName()
export const getLastname = faker.person.lastName()
export const getMiddleName = faker.person.middleName()
export const getEmail = faker.internet.email({ firstName: getFirstName, lastName: getLastname })
export const getGender = faker.person.sex()
export const getCountry = faker.location.county()
export const getState = faker.location.state()
export const getAddress = faker.location.streetAddress()
export const getPassword = faker.internet.password({ length: 6, pattern: /[a-zA-Z]/ })
export const getUserName = faker.internet.userName()
export const getFakeId = faker.string.uuid()
<<<<<<< HEAD
export const getPhone = faker.phone.number()

export function CreateUserModelObject(): IUser {
    return {
        firstName: getFirstName,
        lastName: getLastname,
        age: 20,
        gender: Gender.F,
        middleName: getMiddleName,
        userName: getUserName,
=======
export const getPhone = faker.phone.number().toString()

console.log("PHONE ---=-=-=-", getPhone)

export function CreateUserModelObject(): Omit<User ,"id"> {
    return {
        firstname: getFirstName,
        lastname: getLastname,
        age: 20,
        gender: Gender.F,
        middlename: getMiddleName,
        username: getUserName,
>>>>>>> testing
        email: getEmail,
        password: getPassword,
        country: getCountry,
        state: getState,
<<<<<<< HEAD
        phoneNumber: getPhone,
        address: getAddress,
        lastLogin: null
=======
        phone_number: getPhone,
        address: getAddress,
        lastlogin: null
>>>>>>> testing
    }
}
export function CreateUserObject(overrides: { [key: string]: boolean | string | number } = {}): RegisterUserPayload {
    return {
        firstname: getFirstName,
        lastname: getLastname,
        middlename: getMiddleName,
        age: 18,
        state: getState,
        country: getCountry,
        gender: getGender as Gender,
        address: getAddress,
        email: getEmail,
        password: "fakepassword",
        username: getUserName,
        phone_number: getPhone,
        ...overrides
    }
}
