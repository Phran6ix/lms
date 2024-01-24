import { JwtPayload, sign, verify } from "jsonwebtoken";
import { v4 } from "uuid";
import bcrypt from "bcrypt";
import config from "./config";

export type VerifyJWTType = { token: string }
export type TSignJWt = { id: string }
export type THashpassword = {password: string}
export type TCompareHashpassword = {password: string, hashed: string}

export default class Helper {
  static signJWT(payload: TSignJWt): string {
    return sign(payload, config.JWT_SECRET, { expiresIn: "1d" });
  }

  static verifyJWT(payload: VerifyJWTType): JwtPayload {
    try {
      return verify(payload.token, config.JWT_SECRET) as JwtPayload;
    } catch (error) {
      throw error;
    }
  }

  static hashPassword(payload: THashpassword): string {
    return bcrypt.hashSync(payload.password, 13)
  }

  static comparePassword(payload: TCompareHashpassword): boolean {
    return bcrypt.compareSync(payload.password, payload.hashed)
  }

  static UUID(): string {
    return v4()
  }
}
