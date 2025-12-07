import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const createUser = async (payload: Record<string, unknown>) => {
  let keys = [];
  let values = [];

  const expectedProperties = ["name", "email", "password", "phone", "role"];

  for (const key in payload) {
    if (expectedProperties.includes(key)) {
      keys.push(key);
      values.push(payload[key]);
    }
  }

  const updateQuery = keys.map((key, i) => `$${i + 1}`).join(", ");

  const passwordIndex = keys.indexOf("password");
  const password = values[passwordIndex];
  const hashedPassword = await bcrypt.hash(password as string, 10);
  values[passwordIndex] = hashedPassword;

  const result = await pool.query(
    `INSERT INTO Users (${keys}) VALUES(${updateQuery}) RETURNING id, name, email, phone, role`,
    [...values]
  );
  return result;
};

const userSignIn = async (payload: Record<string, unknown>) => {
  // const { email, password } = payload;

  let keys = [];
  let values = [];

  const expectedProperties = ["email", "password"];

  for (const key in payload) {
    if (expectedProperties.includes(key)) {
      keys.push(key);
      values.push(payload[key]);
    }
  }

  const emailIndex = keys.indexOf("email");
  const email = values[emailIndex];

  const passwordIndex = keys.indexOf("password");
  const password = values[passwordIndex];

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
