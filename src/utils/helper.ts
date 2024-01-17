import { JwtPayload, sign, verify } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "./config";

export default class Helper {
  static signJWT(payload: { id: string }): string {
    return sign(payload, config.JWT_SECRET, { expiresIn: "1d" });
  }

  static verifyJWT(token: string): JwtPayload {
    try {
      return verify(token, config.JWT_SECRET) as JwtPayload;
    } catch (error) {
      throw error;
    }
  }

  static hashPassword(password: string): string {
    return bcrypt.hashSync(password, 13)
  }

  static comparePassword(password: string, hashed: string): boolean {

    return bcrypt.compareSync(password, hashed)
  }
}
