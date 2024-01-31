import { faker } from "@faker-js/faker";
import { IUser } from "../../application/interfaces/userInterface";
import { RegisterUserPayload } from "../../validations/user.validation";
import { Gender } from "../../common/types";

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

export function CreateUserObject(overrides: { [key: string]: boolean | string | number} = {}): RegisterUserPayload {
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
        ...overrides
    }
}
