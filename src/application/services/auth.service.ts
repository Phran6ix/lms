import { IEmailService, TEmailPayload } from "../../common/BaseEmailInterfae";
import { ResponseType } from "../../common/responseType";
import events from "../../services/events";
import HTTPException, { DuplicateError } from "../../utils/exception";
import Helper from "../../utils/helper";
import { RegisterUserPayload, UserSignInPayload } from "../../validations/user.validation";
import { User } from "../entity/user";
import { UserMapper } from "../mapper/user";
import { IUserRepo } from "../repository/user.repository";

export type TChangePassword = { id: string, password: string, new_password: string }
export type TVerifyUser = { id: string }
export default class AuthService {
	private readonly repo: IUserRepo;
	constructor(repo: IUserRepo) {
		this.repo = repo
	}

	public async RegisterUser(payload: RegisterUserPayload): Promise<ResponseType> {
		try {
			const userExist = await this.repo.findUserByEmail(payload.email)
			console.log("User Exist", userExist)
			if (userExist) {
				throw DuplicateError("User with email already exist")
			}
			const password = Helper.hashPassword({ password: payload.password })
			const userDTO = new UserMapper().toPersistence({ ...payload as unknown as User })
console.log("result of dto", userDTO)
			const newUser = await this.repo.createUser({ ...userDTO, password })

			const emailPayload: TEmailPayload = {
				email: newUser.email,
				subject: "One-Time Password",
				message: `The otp will be up and running soon`,
				name: newUser.firstname + " " + newUser.lastname
			}
			// await this.email.sendEmail({ ...emailPayload })
			// events.emit("sendEmail", emailPayload)
			console.log("SErvice Over")
			return {
				code: 201,
				message: "User has been created successfully",
				data: { user: newUser }
			}
		} catch (error) {
			throw error
		}
	}
	public async UserSignIn(payload: UserSignInPayload): Promise<ResponseType> {
		try {
			let user: User | null
			if (payload.email) {
				user = await this.repo.findUserByEmail(payload.email)
			}
			else if (payload.username) {
				user = await this.repo.findUserByUsername(payload.username)
			}
			else {
				throw new HTTPException("Email and Username field cannot be empty", 400)
			}

			if (!user) {
				throw new HTTPException("User does not exist", 404)
			}


			if (!Helper.comparePassword({ password: payload.password, hashed: user.password })) {
				throw new HTTPException("Invalid password", 400)
			}
			if (!user.is_verified) {
				throw new HTTPException("Your account is not verified", 403)
			}
			await this.repo.updateUser(user.id, { lastLogin: new Date() })
			const token = Helper.signJWT({ id: user.id })
			return {
				code: 200,
				message: "You have successfully logged in",
				data: { user, token }
			}
		} catch (error) {
			throw error
		}
	}

	public async verifyUser(payload: TVerifyUser): Promise<ResponseType> {
		try {
			const user = await this.repo.findUserById(payload.id)
			if (user!.is_verified) {
				throw new HTTPException("User is already verified", 400)
			}

			const updateduser = await this.repo.updateUser(payload['id'], { isVerified: true })
			return {
				code: 200,
				message: "Your account has been activated",
				data: { user: updateduser }
			}

		} catch (error) {
			throw error
		}
	}
	public async changePassword(payload: TChangePassword): Promise<ResponseType> {
		try {
			const user = await this.repo.findUserById(payload.id)

			if (!Helper.comparePassword({ password: payload.password, hashed: user.password })) {
				throw new HTTPException("Invalid password", 400)
			}

			const hashedpassword = Helper.hashPassword({ password: payload.new_password })
			const updatedUser = await this.repo.updateUser(user.id, { password: hashedpassword })

			return {
				code: 200,
				message: "User password has been changed successfully",
				data: { user: updatedUser }
			}
		} catch (error) {
			throw error
		}
	}
}
