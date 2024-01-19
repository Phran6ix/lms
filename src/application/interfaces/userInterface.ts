import { Document } from 'mongoose'

export interface IUser {
	userId: string;
	_id?: string;
	firstName: string;
	lastName: string;
	middleName: string;
	userName: string;
	password: string;
	age: number;
	email: string;
	address: string;
	state: string;
	country: string
	gender: string;
	isVerified: boolean;
	phoneNumber: string;

}

export interface IUserDoc extends Document{}
