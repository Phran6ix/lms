import { ResponseType } from "../../common/responseType";
import HTTPException from "../../utils/exception";
import Helper from "../../utils/helper";
import { RegisterUserPayload, UserSignInPayload } from "../../validations/user.validation";
import { User } from "../entity/user";
import { IUserRepo } from "../repository/user.repository";

export default class UserService {
	private readonly repo: IUserRepo;
	constructor(repo: IUserRepo) {
		this.repo = repo
	}

	public async RegisterUser(payload: RegisterUserPayload): Promise<ResponseType> {
		try {
			const userExist = await this.repo.findUserByEmail(payload.email)
			if(userExist) {
				throw new HTTPException("User with Email already exists")
			}

			const newUser = await this.repo.createUser(payload)

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


		if (!Helper.comparePassword(user.password, payload.password)) {
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
	}


}
