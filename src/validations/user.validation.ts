import { z } from "zod";

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
    gender: z.nativeEnum(Gender)
})

export type RegisterUserPayload = z.TypeOf<typeof RegisterUserPayload>


export const UserSignInPayload = z.object({
    email: z.string().email().optional(),
    username: z.string().optional(),
    password: z.string()
})

export type UserSignInPayload = z.TypeOf<typeof UserSignInPayload>

export const ChangePasswordPayload = z.object({
    password: z.string(),
    new_password: z.string()
}).refine(data => data.password != data.new_password, {message: "new password cannot be the same as old password"})
