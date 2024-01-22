import { faker } from "@faker-js/faker";
import { IUser } from "../../application/interfaces/userInterface";
import { RegisterUserPayload } from "../../validations/user.validation";

const getFirstName = faker.person.firstName()
const getLastname = faker.person.lastName()
const getMiddleName = faker.person.middleName()
const getEmail = faker.internet.email({ firstName: getFirstName, lastName: getLastname })
const getGender = faker.person.sex()
const getCountry = faker.location.county()
const getState = faker.location.state()
const getAddress = faker.location.streetAddress()
const getPassword = faker.internet.password({ length: 6, pattern: /[a-zA-Z]/ })
const getUserName = faker.internet.userName()
const getFakeId = faker.datatype.uuid()

function RegisterUserObject(overrides: [key: string]: string): RegisterUserPayload {
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
        password: getPassword,
        username: getUserName,

    }
}
