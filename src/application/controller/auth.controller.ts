import { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service";
import { UserRepository } from "../repository/user.repository";
import BaseController from "../../common/BaseController";
import userModel from "../database/userModel";
import { ChangePasswordPayload, RegisterUserPayload, UserSignInPayload } from "../../validations/user.validation";
import HTTPException from "../../utils/exception";
import SMTPExpress from "../../services/smtpexpress";


export default class AuthController extends BaseController {
	private readonly service: AuthService
	constructor(req: Request, res: Response, next: NextFunction) {
		super(req, res, next)
		this.req = req;
		this.res = res;
		this.next = next;

		this.service = new AuthService(new UserRepository(userModel), new SMTPExpress())
	}

	public async HTTPRegisterUser(): Promise<Response> {
		try {
			const payload = RegisterUserPayload.safeParse(this.req.body)
			if (!payload.success) {
				throw new HTTPException(`Invalid input ${payload.error}`, 400)
			}
			const service = await this.service.RegisterUser(payload.data)
			return this.sendResponse(service)
		} catch (error) {
			return this.sendErrorResponse(error)
		}
	}

	public async HTTPUserSign(): Promise<Response> {
		try {
			const payload = UserSignInPayload.safeParse(this.req.body)
			if (!payload.success) {
				throw new HTTPException(`Invalid input - ${payload.error}`, 400)
			}

			const login = await this.service.UserSignIn(payload.data)
			return this.sendResponse(login)
		} catch (error) {
			return this.sendErrorResponse(error)
		}
	}

	public async HTTPChangePassword(): Promise<Response> {
		try {
			const payload = ChangePasswordPayload.safeParse(this.req.body)
			if (!payload.success) {
				throw new HTTPException(`Invalid input - ${payload.error}`, 400)
			}

			const response = await this.service.changePassword({ id: this.req.userId, ...payload.data })

			return this.sendResponse(response)
		} catch (error) {
			return this.sendErrorResponse(error)
		}
	}
}
