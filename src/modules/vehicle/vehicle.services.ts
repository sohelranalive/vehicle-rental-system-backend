import { pool } from "../../config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
  let keys = [];
  let values = [];

  const expectedProperties = [
    "vehicle_name",
    "type",
    "registration_number",
    "daily_rent_price",
    "availability_status",
  ];

  for (const key in payload) {
    if (expectedProperties.includes(key)) {
      keys.push(key);
      values.push(payload[key]);
    }
  }
  const updateQuery = keys.map((key, i) => `$${i + 1}`).join(", ");

  const result = await pool.query(
    `INSERT INTO Vehicles (${keys}) VALUES(${updateQuery}) RETURNING *`,
    [...values]
  );
  return result;
};

const getAllVehicle = async () => {
  const result = await pool.query(`SELECT * FROM Vehicles`);
  return result;
};

const getSingleVehicle = async (id: string) => {
  const result = await pool.query(`SELECT * FROM Vehicles WHERE id=$1`, [id]);
  return result;
};

const updateVehicleInfo = async (
  id: string,
  payload: Record<string, unknown>
) => {
  let keys = [];
  let values = [];

  const expectedProperties = [
    "vehicle_name",
    "type",
    "registration_number",
    "daily_rent_price",
    "availability_status",
  ];

  for (const key in payload) {
    if (expectedProperties.includes(key)) {
      keys.push(key);
      values.push(payload[key]);
    }
  }

  const updateQuery = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const result = await pool.query(
    `UPDATE Vehicles SET ${updateQuery} WHERE id=$${
      keys.length + 1
    } RETURNING *`,
    [...values, id]
  );
  return result;
};

const deleteVehicle = async (id: string) => {
  const result = await pool.query(
    `DELETE FROM Vehicles WHERE id=$1 AND availability_status='available'`,
    [id]
  );
  return result;
};

const getVehiclesViaCustomer = async (id: string) => {
  const result = await pool.query(
    `SELECT * FROM Bookings WHERE customer_id=$1`,
    [id]
  );
  return result;
};

export const vehicleServices = {
  createVehicle,
  getAllVehicle,
  getSingleVehicle,
  updateVehicleInfo,
  deleteVehicle,
  getVehiclesViaCustomer,
};
