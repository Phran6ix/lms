import { z } from "zod";
import { Gender } from "../common/types";

export const RegisterUserPayload = z.object({
    firstname: z.string(),
    lastname: z.string(),
    middlename: z.string(),
    username: z.string(),
    country: z.string(),
    address: z.string(),
    state: z.string(),
    password: z.string().min(6).regex(new RegExp(/[a-zA-z0-9]/)),
    age: z.number().min(16),
    email: z.string().email(),
    gender: z.nativeEnum(Gender),
    phone_number: z.string()
})

export type RegisterUserPayload = z.TypeOf<typeof RegisterUserPayload>

const emailCheck = z.string().email()
const usernameCheck = z.string().min(5)

export const UserSignInPayload = z.object({
    identifier: z.string(), 
    password: z.string()
})

export const LoginPayload = UserSignInPayload.extend({
    identifier: z.string().refine(val => {
        if (val.includes("@")) {
            return emailCheck.safeParse(val).success
        }else {
            return usernameCheck.safeParse(val).success
        }
    }, {message: "Invalid input"})
})
export type UserSignInPayload = z.TypeOf<typeof UserSignInPayload>

export const ChangePasswordPayload = z.object({
    password: z.string(),
    new_password: z.string()
}).refine(data => data.password != data.new_password, {message: "new password cannot be the same as old password"})
