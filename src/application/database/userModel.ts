import { Schema, model } from "mongoose";
import { IUser } from "../interfaces/userInterface";
import Helper from "../../utils/helper";
import { Gender } from "../../common/types";

const userSchema = new Schema<IUser>({
	userId: {
		type: String,
		index: true,
		unique: true,
		default: () => Helper.UUID()
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	middleName: {
		type: String,
		required: false
	},
	age: {
		type: Number,
		required: true,
		min: [16, "You have to be at least 16 to have an account"]
	},
	gender: {
		type: String,
		enum: Gender,
		required: true
	},
	email: {
		type: String,
		unique: true,
		index: true,
		required: true
	},
	password: {
		type: String
	},
	address: {
		type: String
	},
	country: {
		type: String
	},
	state: {
		type: String
	},
	isVerified: {
		type: Boolean, default: false
	},
	phoneNumber: {
		type: String,
		required: true
	},
	userName: {
		type: String,
		index: true,
		unique: true,
		required: true
	},
	lastLogin: {
		type: Date
	}
},
	{
		timestamps: true,
		versionKey: false,
		toJSON: {
			transform: function(doc, ret) {
				delete ret.password
				return ret
			}
		}
	}
)

const userModel = model<IUser>("User", userSchema)
export default userModel
