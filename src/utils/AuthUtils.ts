import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export default class AuthUtils {
  public static generateJwtToken(id: Types.ObjectId | number) {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
      expiresIn: "30d",
    });
  }

  public static async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  public static async passwordsAreEqual(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
