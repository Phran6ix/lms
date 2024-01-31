export interface User {
	id: string;
	firstname: string;
	lastname: string;
	password: string;
	middlename: string;
	username: string;
	is_verified: boolean;
	gender: string;
	email: string;
	age: number;
	country: string;
	address: string;
	phone_number: string;
	state: string;
	lastlogin: Date

}

export interface UserDTO {

	id: string;
	firstname: string;
	lastname: string;
	middlename: string;
	username: string;
	verified: boolean;
	gender: string;
	email: string;
	age: number;
	address: {
		country: string;
		address: string;
		state: string;
	}
	phone_number: string;
	lastlogin: string
}
