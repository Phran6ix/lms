import { IUser } from "../interfaces/userInterface"
import { User, UserDTO } from "../entity/user"
import { Mapper } from "../../common/mapper"
import { ObjectId } from "mongodb"

export class UserMapper extends Mapper<IUser, User, UserDTO>{
	public toDTO(user: User): UserDTO {
		return {
			id: user.id,
			firstname: user.firstname,
			lastname: user.lastname,
			middlename: user.middlename,
			username: user.username,
			address: {
				country: user.country,
				address: user.address,
				state: user.state
			},
			email: user.email,
			gender: user.gender,
			phone_number: user.phone_number,
			age: user.age,
			verified: user.is_verified as boolean,
			lastlogin: user.lastlogin ? null : user!.lastlogin ,
		}

	}
	public toPersistence(user: User): IUser {
		return {
			firstName: user.firstname,
			lastName: user.lastname,
			userName: user.middlename,
			middleName: user.middlename,
			gender: user.gender,
			age: user.age,
			phoneNumber: user.phone_number,
			password: user.password,
			userId: user.id,
			email: user.email,
			isVerified: user.is_verified,
			state: user.state,
			country: user.country,
			address: user.address,
			lastLogin: !!user.lastlogin ? null : user.lastlogin,
		}
	}
	public toDomain(user: IUser): User {
		return {
			firstname: user.firstName,
			lastname: user.lastName,
			age: user.age,
			middlename: user.middleName,
			is_verified: user.isVerified,
			gender: user.gender,
			id: (user.userId as unknown as string),
			password: user.password,
			email: user.email,
			phone_number: user.phoneNumber,
			address: user.address,
			state: user.state,
			country: user.country,
			username: user.userName,
			lastlogin: user.lastLogin
		}
	}
}
