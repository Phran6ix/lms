import UserService from "../application/services/auth.service";
import { IUserRepo, UserRepository } from "../application/repository/user.repository";
import { UserSpyRepo } from "./testObjects/user.spyrepo";
import { CreateUserObject, getFakeId } from "../utils/tests/generate";
import HTTPException, { DuplicateError } from "../utils/exception";
import { RegisterUserPayload, UserSignInPayload } from "../validations/user.validation";
import { User } from "../application/entity/user";
import Helper from "../utils/helper";
import exp from "constants";

describe("Authentication", () => {
    let userRepository: IUserRepo;
    let userService: UserService
    beforeEach(() => {
        userRepository = new UserSpyRepo([])
        userService = new UserService(userRepository)
    })

    describe("create user", () => {
        test("it should throw an HTTPException when user email already exists", async () => {
            const existingUser = CreateUserObject()
            const account = await userService.RegisterUser(existingUser)
            const newUser = CreateUserObject({ email: existingUser.email })

            jest.spyOn(userRepository, "createUser")

            await expect(userService.RegisterUser(newUser)).rejects.toThrow(HTTPException)
            expect(userRepository.createUser).not.toHaveBeenCalled()
        })

        test("it should successfully create a new user", async () => {
            const userData: RegisterUserPayload = CreateUserObject()


            jest.spyOn(userRepository, "createUser").mockResolvedValueOnce({ ...userData } as User)
            const account = await userService.RegisterUser(userData)



            expect(userRepository.createUser).toHaveBeenCalledWith({ ...userData, password: expect.any(String) })
            expect(account).toHaveProperty("code", 201)
        })
    })

    describe("Sign In", () => {
        test("Invalid input should return 400 error", async () => {
            const payload = {} as UserSignInPayload
            jest.spyOn(userRepository, "findUserByEmail")
            jest.spyOn(userRepository, "findUserByUsername")
            await expect(userService.UserSignIn(payload)).rejects.toThrow(HTTPException)
            expect(userRepository.findUserByUsername).not.toHaveBeenCalled()
            expect(userRepository.findUserByEmail).not.toHaveBeenCalled()
        })

        test("It should throw a 404 if a user with email does not exist", async () => {
            const payload: UserSignInPayload = { email: "example@email.com" } as UserSignInPayload

            jest.spyOn(userRepository, "findUserByEmail").mockResolvedValueOnce(null)


            await expect(userService.UserSignIn(payload)).rejects.toThrow(HTTPException)
            expect(userRepository.findUserByEmail).toHaveBeenCalledWith(payload.email)
        })

        test("it should return 404 if a user with username does not exist", async () => {
            const payload = { username: "username" } as UserSignInPayload

            jest.spyOn(userRepository, "findUserByUsername").mockResolvedValueOnce(null)

            await expect(userService.UserSignIn(payload)).rejects.toThrow(HTTPException)
            expect(userRepository.findUserByUsername).toHaveBeenCalledWith(payload.username)
        })

        test("it should return a 400 if a user exist with incorrect password", async () => {
            const payload = { password: "incorrectpassword", email: "example@email.com" } as UserSignInPayload

            const userData = CreateUserObject({ email: "example@gmail" }) as User

            jest.spyOn(userRepository, "findUserByEmail").mockResolvedValueOnce(userData)

            await expect(userService.UserSignIn(payload)).rejects.toThrow(HTTPException)
            expect(userRepository.findUserByEmail).toHaveBeenCalledWith(payload.email)


        })

        test("it should return a 400 if the user is not verified", async () => {
            const payload = { password: "password", email: "example@email.com" } as UserSignInPayload

            jest.spyOn(userRepository, "findUserByEmail").mockResolvedValueOnce({ email: "example@email.com", is_verified: false, password: "hashedpassword" } as User)
            jest.spyOn(Helper, "comparePassword").mockReturnValue(true)
            await (expect(userService.UserSignIn(payload))).rejects.toThrow(HTTPException)
            expect(Helper.comparePassword).toHaveBeenCalled()
            expect(Helper.comparePassword).toHaveBeenCalledWith("password", "hashedpassword")
            expect(Helper.comparePassword).toHaveBeenCalledTimes(1)
            expect(userRepository.findUserByEmail).toHaveBeenCalledTimes(1)
        })

        test("it should return a 400 if the user inputs an incorrect password", async () => {
            const payload = { password: "password", email: "example@email.com" } as UserSignInPayload

            const userData = CreateUserObject({ is_verified: true, password: "hashedpassword" })
            jest.spyOn(userRepository, "findUserByEmail").mockResolvedValueOnce(userData as User)
            jest.spyOn(Helper, "comparePassword").mockReturnValue(false)

            await expect(userService.UserSignIn(payload)).rejects.toThrow(HTTPException)
            expect(userRepository.findUserByEmail).toHaveBeenCalledTimes(1)
            expect(Helper.comparePassword).toHaveBeenCalledTimes(1)
            expect(Helper.comparePassword).toHaveBeenCalledWith("password", userData.password)

        })

        test("it should return a token if a user is verified and input correct password", async () => {
            const payload = { email: "example@email.com", password: "password" }
            const userData = CreateUserObject({ id: 1, email: "example@email.com", password: "hpassword", is_verified: true })
            jest.spyOn(userRepository, "findUserByEmail").mockResolvedValueOnce(userData as User)

            jest.spyOn(Helper, "comparePassword").mockReturnValue(true)
            const signedInUser = await userService.UserSignIn(payload)

            expect(signedInUser).toHaveProperty("code", 200)
            expect(signedInUser).toHaveProperty("message")
            expect(signedInUser).toHaveProperty("data")
            expect(signedInUser.data).toHaveProperty("user")
            expect(signedInUser.data).toHaveProperty("token")
            expect((signedInUser.data as { token: unknown, user: unknown }).token).not.toBeUndefined()
            expect((signedInUser.data as { token: unknown, user: unknown }).user).not.toBeUndefined()
            expect(typeof (signedInUser.data as { token: unknown, user: unknown }).user).toEqual(typeof userData)
            expect(typeof (signedInUser.data as { token: unknown, user: unknown }).token).toEqual("string")
            
        })
    })
})

