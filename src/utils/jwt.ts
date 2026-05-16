import jwt, { Secret, SignOptions } from "jsonwebtoken";

const SECRET: Secret = process.env.JWT_SECRET || "";

if (!SECRET) {
  throw new Error("JWT_SECRET is not defined in environment");
}

export type JwtPayload = {
  userId: string;
  email: string;
};

export function signToken(
  payload: JwtPayload,
  expiresIn: SignOptions["expiresIn"] = "7d"
) {
  return jwt.sign(payload, SECRET, {
    expiresIn,
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload;
}