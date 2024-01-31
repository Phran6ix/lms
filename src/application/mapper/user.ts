import { IUser } from "../interfaces/userInterface"
import { User, UserDTO } from "../entity/user"
import { Mapper } from "../../common/mapper"

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
			verified: user.is_verified,
			lastlogin: user.lastlogin.toDateString(),
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
			lastLogin: user.lastlogin,
		}
	}
	public toDomain(user: IUser): User {
		return {
			firstname: user.firstName.toString(),
			lastname: user.lastName.toString(),
			age: user.age,
			middlename: user.middleName.toString(),
			is_verified: user.isVerified,
			gender: user.gender,
			id: user.userId.toString(),
			password: user.password,
			email: user.email.toString(),
			phone_number: user.phoneNumber,
			address: user.address.toString(),
			state: user.state.toString(),
			country: user.country.toString(),
			username: user.userName.toString(),
			lastlogin: user.lastLogin
		}
	}
}
