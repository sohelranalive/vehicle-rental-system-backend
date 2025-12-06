import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  const hashedPassword = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO Users (name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role`,
    [name, email, hashedPassword, phone, role ? role : "customer"]
  );
  return result;
};

const userSignIn = async (payload: Record<string, unknown>) => {
  const { email, password } = payload;

  const result = await pool.query(`SELECT * FROM Users WHERE email=$1`, [
    email,
  ]);

  const currentUser = result.rows[0];

  if (!currentUser) {
    return false;
  }

  const hashedPassword = currentUser.password;

  const matchedPassword = await bcrypt.compare(
    password as string,
    hashedPassword
  );

  if (matchedPassword) {
    const token = jwt.sign(
      {
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        role: currentUser.role,
      },
      config.jwt_secret as string,
      { expiresIn: "7d" }
    );

    const { password, ...remainingInfo } = currentUser;

    return { token: token, user: remainingInfo };
  }

  return false;
};

export const authServices = {
  createUser,
  userSignIn,
};
