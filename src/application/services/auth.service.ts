import { IEmailService } from "../../common/BaseEmailInterfae";
import { ResponseType } from "../../common/responseType";
import HTTPException, { DuplicateError } from "../../utils/exception";
import Helper from "../../utils/helper";
import { RegisterUserPayload, UserSignInPayload } from "../../validations/user.validation";
import { User } from "../entity/user";
import { IUserRepo } from "../repository/user.repository";

export type TVerifyUser = { id: string }
export default class UserService {
	private readonly repo: IUserRepo;
	// email: IEmailService;
	constructor(repo: IUserRepo, email_service?: IEmailService) {
		this.repo = repo
		// this.email = email_service
	}

	public async RegisterUser(payload: RegisterUserPayload): Promise<ResponseType> {
		try {
			const userExist = await this.repo.findUserByEmail(payload.email)
			if (userExist) {
				throw DuplicateError("User with email already exist")
			}
			const password = Helper.hashPassword({ password: payload.password })
			const newUser = await this.repo.createUser({ ...payload, password })
// await this.email.sendEmail({})
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
			if(user!.is_verified) {
				throw new HTTPException("User is already verified", 400)
			}

			const updateduser = await this.repo.updateUser(payload['id'], { isVerified: true })
			return {
				code: 200,
				message: "Your account has been activated",
				data: { user : updateduser}
			}

		} catch (error) {
			throw error
		}
	}
}
