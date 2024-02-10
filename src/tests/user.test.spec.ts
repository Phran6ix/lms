import UserService from "../application/services/auth.service";
import { IUserRepo, UserRepository } from "../application/repository/user.repository";
import { UserSpyRepo } from "./testObjects/user.spyrepo";
import { CreateUserObject, getFakeId } from "../utils/tests/generate";
import HTTPException, { DuplicateError } from "../utils/exception";
import { RegisterUserPayload, UserSignInPayload } from "../validations/user.validation";
import { User } from "../application/entity/user";
import Helper from "../utils/helper";
import { UserMapper } from "../application/mapper/user";
// import SMTPExpress from "../services/smtpexpress";

describe("Authentication", () => {
    let userRepository: IUserRepo;
    let userService: UserService
    // let email_service: SMTPExpress
    beforeEach(() => {
        userRepository = new UserSpyRepo([])
        // email_service = new SMTPExpress()
        userService = new UserService(userRepository) //, email_service)

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


            const userDTO = new UserMapper().toPersistence({ ...userData as unknown as User })
            jest.spyOn(userRepository, "createUser").mockResolvedValueOnce({ ...userData } as unknown as User)
            // jest.spyOn(email_service, "sendEmail").mockResolvedValueOnce()
            const account = await userService.RegisterUser(userData)


            expect(userRepository.createUser).toHaveBeenCalledWith({ ...userDTO, password: expect.any(String) })
            // expect(email_service.sendEmail).toHaveBeenCalled()
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
            const payload = { password: "incorrectpassword", email: "example@email.com", username: "username" } as UserSignInPayload

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
            expect(Helper.comparePassword).toHaveBeenCalledWith({ password: "password", hashed: "hashedpassword" })
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
            expect(Helper.comparePassword).toHaveBeenCalledWith({ password: "password", hashed: userData.password })

        })

        test("it should return a token if a user is verified and input correct password", async () => {
            const payload = { email: "example@email.com", password: "password" }
            const userData = CreateUserObject({ id: 1, email: "example@email.com", password: "hpassword", is_verified: true }) as User
            jest.spyOn(userRepository, "findUserByEmail").mockResolvedValueOnce(userData as User)

            jest.spyOn(Helper, "comparePassword").mockReturnValue(true)
            jest.spyOn(userRepository, "updateUser").mockResolvedValueOnce(userData)
            const signedInUser = await userService.UserSignIn(payload)

            expect(signedInUser).toHaveProperty("code", 200)
            expect(signedInUser).toHaveProperty("message")
            expect(signedInUser).toHaveProperty("data")
            expect(signedInUser.data).toHaveProperty("user")
            expect(signedInUser.data).toHaveProperty("token")
            expect(userRepository.updateUser).toHaveBeenCalledWith(userData.id, { lastLogin: expect.any(Date) })
            expect((signedInUser.data as { token: unknown, user: unknown }).token).not.toBeUndefined()
            expect((signedInUser.data as { token: unknown, user: unknown }).user).not.toBeUndefined()
            expect(typeof (signedInUser.data as { token: unknown, user: unknown }).user).toEqual(typeof userData)
            expect(typeof (signedInUser.data as { token: unknown, user: unknown }).token).toEqual("string")

        })
    })

    describe("Verification", () => {
        test("it should return a 400 if a user is already verified", async () => {
            const payload = { id: '1' }

            const userObject = CreateUserObject({ is_verified: true }) as User
            jest.spyOn(userRepository, "findUserById").mockResolvedValue(userObject)

            await expect(userService.verifyUser(payload)).rejects.toThrow(HTTPException)
            expect(userRepository.findUserById).toHaveBeenCalledWith('1')
            expect(userRepository.findUserById).toHaveReturnedTimes(1)
        })

        test("it should update the user verification field of the user", async () => {
            const payload = { id: "1" }

            const userObject = CreateUserObject({ is_verified: false }) as User
            jest.spyOn(userRepository, "findUserById").mockResolvedValueOnce(userObject)
            jest.spyOn(userRepository, "updateUser").mockResolvedValueOnce({ ...userObject, is_verified: true })

            const verified_user = await userService.verifyUser(payload)

            expect(userRepository.findUserById).toHaveBeenCalledTimes(1)
            expect(userRepository.findUserById).toHaveBeenCalledWith("1")
            expect(userRepository.updateUser).toHaveBeenCalledWith("1", { isVerified: true })
            expect(verified_user).toEqual({ code: 200, message: expect.any(String), data: expect.anything() })

        })
    })

    describe("Change password", () => {
        const payload = { id: "1", password: "password", new_password: "newPassword" }
        const genUser = CreateUserObject() as User
        test("Invalid password should throw a 404 error", async () => {
            jest.spyOn(userRepository, "findUserById").mockResolvedValueOnce(genUser)
            jest.spyOn(Helper, "comparePassword").mockReturnValue(false)

            jest.spyOn(userRepository, "updateUser").mockResolvedValueOnce(genUser as User)

            await expect(userService.changePassword(payload)).rejects.toThrow(HTTPException)
            expect(userRepository.findUserById).toHaveBeenCalledWith("1")
            expect(userRepository.updateUser).not.toHaveBeenCalled()

        })
        test("Password should be updated if input password is correct", async () => {
            jest.spyOn(userRepository, "findUserById").mockResolvedValueOnce({ ...genUser, id: "1" })
            jest.spyOn(Helper, "comparePassword").mockReturnValue(true)
            let hashedpassword = "hashed password test"
            jest.spyOn(Helper, "hashPassword").mockReturnValue(hashedpassword)

            jest.spyOn(userRepository, "updateUser").mockResolvedValueOnce({ ...genUser, password: hashedpassword })

            const changePassword = await userService.changePassword(payload)

            expect(userRepository.findUserById).toHaveBeenCalledWith("1")
            expect(userRepository.findUserById).toHaveBeenCalledTimes(1)

            expect(userRepository.updateUser).toHaveBeenCalledTimes(1)
            expect(userRepository.updateUser).toHaveBeenCalledWith("1", { password: hashedpassword })
        })
    })

})

