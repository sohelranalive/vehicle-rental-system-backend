import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../config/db";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authToken = req.headers.authorization;
      if (authToken && authToken.startsWith("Bearer ")) {
        const token = authToken.split(" ")[1] as string;

        const verifiedToken = jwt.verify(
          token,
          config.jwt_secret as string
        ) as JwtPayload;
        req.currentUser = verifiedToken;

        const result = await pool.query(`SELECT * FROM Users WHERE email=$1`, [
          req.currentUser.email,
        ]);

        if (roles.includes(verifiedToken.role) && result.rows.length > 0) {
          next();
        } else {
          return res.status(403).json({
            success: false,
            message: "Unverified, you are not authorized",
          });
        }
      } else {
        return res.status(403).json({
          success: false,
          message: "No bearer token found or invalid token",
        });
      }

      // try {
      //   console.log(req.headers.authorization);
      //   const token = req.headers.authorization;
      //   if (!token) {
      //     return res.status(403).json({
      //       success: false,
      //       message: "You are not authorized",
      //     });
      //   }

      //   const verifiedToken = jwt.verify(
      //     token,
      //     config.jwt_secret as string
      //   ) as JwtPayload;
      //   req.currentUser = verifiedToken;

      //   const result = await pool.query(`SELECT * FROM Users WHERE email=$1`, [
      //     req.currentUser.email,
      //   ]);

      //   if (roles.includes(verifiedToken.role) && result.rows.length > 0) {
      //     next();
      //   } else {
      //     return res.status(403).json({
      //       success: false,
      //       message: "Unverified, you are not authorized",
      //     });
      //   }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

export default auth;
