import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface IDecodedToken {
  exp: number;
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] as string;
    const decodedToken = jwt.decode(token) as IDecodedToken;
    const nowTimestamp = parseInt((Date.now() / 1000).toString());

    if (nowTimestamp > decodedToken.exp) return res.status(401).json();

    return next();
  } catch (error) {
    res.status(401).json();
  }
};
