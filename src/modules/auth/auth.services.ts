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

  if (!keys.length) {
    return false;
  }

  if (keys.includes("password")) {
    const passwordIndex = keys.indexOf("password");
    const password = values[passwordIndex];
    const hashedPassword = await bcrypt.hash(password as string, 10);
    values[passwordIndex] = hashedPassword;
  }

  const updateQuery = keys.map((key, i) => `$${i + 1}`).join(", ");

  const result = await pool.query(
    `INSERT INTO Users (${keys}) VALUES(${updateQuery}) RETURNING id, name, email, phone, role`,
    [...values]
  );
  return result;
};

const userSignIn = async (payload: Record<string, unknown>) => {
  let keys = [];
  let values = [];

  const expectedProperties = ["email", "password"];

  for (const key in payload) {
    if (expectedProperties.includes(key)) {
      keys.push(key);
      values.push(payload[key]);
    }
  }

  if (!keys.includes("password")) {
    return false;
  }

  const emailIndex = keys.indexOf("email");
  const email = values[emailIndex];

  const passwordIndex = keys.indexOf("password");
  const password = values[passwordIndex];

  const findUser = await pool.query(`SELECT * FROM Users WHERE email=$1`, [
    email,
  ]);

  const user = findUser.rows[0];

  if (!user) {
    return false;
  }

  const hashedPassword = user.password;

  const matchedPassword = await bcrypt.compare(
    password as string,
    hashedPassword
  );

  if (matchedPassword) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      config.jwt_secret as string,
      { expiresIn: "7d" }
    );
    const { password, ...remainingInfo } = user;

    return { token: token, user: remainingInfo };
  }

  return false;
};

export const authServices = {
  createUser,
  userSignIn,
};
