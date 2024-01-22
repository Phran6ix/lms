import UserService from "../application/services/auth.service";
import { IUserRepo } from "../application/repository/user.repository";
import { UserSpyRepo } from "./testObjects/user.spyrepo";

describe("users", () => {
    let userRepository: IUserRepo;
    let userService: UserService
    beforeEach(() => {
        userRepository = new UserSpyRepo([])
        userService = new UserService(userRepository)
    })

     describe("create user", () => {
        test("")
    })
})

