import { Result } from "pg";
import { pool } from "../../config/db";

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM Users`
  );
  return result;
};

const updateUser = async (
  payload: Record<string, unknown>,
  editorRole: string,
  id: string
) => {
  if (editorRole === "customer") {
    let keys = [];
    let values = [];

    const expectedKeys = ["name", "email", "phone"];

    for (const key in payload) {
      if (expectedKeys.includes(key)) {
        keys.push(key);
        values.push(payload[key]);
      }
    }

    const updateQuery = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");

    const result = await pool.query(
      `UPDATE Users SET ${updateQuery} WHERE id=$${
        keys.length + 1
      } RETURNING id, name, email, phone, role`,
      [...values, id]
    );

    return result;
  }

  let keys = [];
  let values = [];

  const expectedKeys = ["name", "email", "phone", "role"];

  for (const key in payload) {
    if (expectedKeys.includes(key)) {
      keys.push(key);
      values.push(payload[key]);
    }
  }
  const updateQuery = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const result = await pool.query(
    `UPDATE Users SET ${updateQuery} WHERE id=$${
      keys.length + 1
    } RETURNING id, name, email, phone, role`,
    [...values, id]
  );

  return result;
};

const deleteUser = async (id: string) => {
  const result = await pool.query(`DELETE FROM Users WHERE id=$1`, [id]);
  return result;
};

export const userServices = {
  getAllUsers,
  updateUser,
  deleteUser,
};
