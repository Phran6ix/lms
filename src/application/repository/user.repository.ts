import { Model } from "mongoose";
import UserModel from "../database/userModel";
import { User } from "../entity/user";
import { IUser } from "../interfaces/userInterface";
import { UserMapper } from "../mapper/user";

export interface IUserRepo {
	createUser(user: Partial<IUser>): Promise<User>;
	findUserByEmail(email: string): Promise<User | null>
	findUserByUsername(username: string): Promise<User | null>
	findUserById(id: string): Promise<User>
	fetchAllUser(filter: Partial<IUser>): Promise<User[]>
	deleteUser(id: string): Promise<void>
	updateUser(id: string, payload: Partial<IUser>): Promise<User>
}
export class UserRepository implements IUserRepo {
	model: Model<IUser>
	constructor(model: Model<IUser>) {
		this.model = model
	}
	async updateUser(id: string, payload: Partial<IUser>): Promise<User> {
		try {
			const user = await this.model.findOneAndUpdate({ userId: id }, { ...payload }, { new: true }).lean() as IUser
			return new UserMapper().toDomain(user)
		} catch (error) {
			throw error
		}
	}
	async createUser(user: Partial<IUser>): Promise<User> {
		try {
			console.log("the expected", user)
			const newUser = await this.model.create({ ...user })

			return new UserMapper().toDomain(newUser)
		} catch (error) {
			throw error
		}
	}
	async findUserByEmail(email: string): Promise<User | null> {
		try {
			const user = await this.model.findOne({ email }).lean()
console.log("MY USer wey dey stress", user)
			return !!user ? new UserMapper().toDomain(user) : null
		} catch (error) {
			throw error
		}
	}
	async findUserByUsername(userName: string): Promise<User | null> {
		try {
			const user = await this.model.findOne({ userName })
			return !!user ? new UserMapper().toDomain(user) : null
		} catch (error) {
			throw error
		}
	}
	async findUserById(id: string): Promise<User> {
		try {
			const user = await this.model.findOne({ userId: id }).lean() as IUser

			return new UserMapper().toDomain(user)
		} catch (error) {
			throw error
		}
	}
	async fetchAllUser(filter: Partial<IUser>): Promise<User[]> {
		try {
			const users = await this.model.find({ ...filter }).lean()
			return users.map(user => new UserMapper().toDomain(user))
		} catch (error) {
			throw error
		}
	}
	async deleteUser(id: string): Promise<void> {
		try {
			const user = await this.findUserById(id)
			await this.model.deleteOne({ userId: user?.id })
		} catch (error) {
			throw error
		}
	}

}
