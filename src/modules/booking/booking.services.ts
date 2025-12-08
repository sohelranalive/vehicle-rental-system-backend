import { pool } from "../../config/db";
import { vehicleServices } from "../vehicle/vehicle.services";

const createBooking = async (
  payload: Record<string, unknown>,
  currentUserEmail: string,
  currentUserRole: string
) => {
  const { vehicle_id, rent_start_date, rent_end_date } = payload;
  const vehicleDetails = await vehicleServices.getSingleVehicle(
    vehicle_id as string
  );

  // vehicleDetails.rows.length == 0

  if (vehicleDetails.rows[0]?.availability_status == "booked") {
    return false;
  }

  let keys = [];
  let values = [];

  const expectedProperties = [
    "customer_id",
    "vehicle_id",
    "rent_start_date",
    "rent_end_date",
  ];

  for (const key in payload) {
    if (expectedProperties.includes(key)) {
      keys.push(key);
      values.push(payload[key]);
    }
  }

  if (keys.includes("customer_id")) {
    const enteredCustomerId = values[keys.indexOf("customer_id")];
    const findCustomer = await pool.query(`SELECT * FROM Users WHERE id=$1`, [
      enteredCustomerId,
    ]);
    if (findCustomer.rows.length) {
      if (
        findCustomer.rows[0].email == currentUserEmail ||
        currentUserRole == "admin"
      ) {
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    const findCustomer = await pool.query(
      `SELECT * FROM Users WHERE email=$1`,
      [currentUserEmail]
    );
    keys.push("customer_id");
    values.push(findCustomer.rows[0].id);
  }

  keys.push("status");
  values.push("active");

  const requireDays = (
    rent_start_date: string,
    rent_end_date: string
  ): number => {
    const startDate = new Date(rent_start_date);
    const endDate = new Date(rent_end_date);
    const differences = endDate.getTime() - startDate.getTime();
    const days = differences / (1000 * 60 * 60 * 24);
    return days;
  };
  const totalDays = requireDays(
    rent_start_date as string,
    rent_end_date as string
  );
  const total_price = totalDays * vehicleDetails.rows[0]?.daily_rent_price;

  keys.push("total_price");
  values.push(total_price);

  const updateQuery = keys.map((key, i) => `$${i + 1}`).join(", ");

  const first_query = await pool.query(
    `INSERT INTO Bookings (${keys}) VALUES(${updateQuery}) RETURNING *`,
    [...values]
  );

  let second_query: any;

  if (first_query.rows.length > 0) {
    const availability = {
      availability_status: "booked",
    };
    second_query = await vehicleServices.updateVehicleInfo(
      vehicle_id as string,
      availability
    );
  }

  const result = {
    ...first_query.rows[0],
    vehicle: {
      vehicle_name: second_query.rows[0].vehicle_name,
      daily_rent_price: second_query.rows[0].daily_rent_price,
    },
  };

  return result;

  // don't touch
  // const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
  // const status = "active";

  // const vehicleDetails = await vehicleServices.getSingleVehicle(
  //   vehicle_id as string
  // );

  // const requireDays = (
  //   rent_start_date: string,
  //   rent_end_date: string
  // ): number => {
  //   const startDate = new Date(rent_start_date);
  //   const endDate = new Date(rent_end_date);
  //   const differences = endDate.getTime() - startDate.getTime();
  //   const days = differences / (1000 * 60 * 60 * 24);
  //   return days;
  // };
  // const totalDays = requireDays(
  //   rent_start_date as string,
  //   rent_end_date as string
  // );
  // const total_price = totalDays * vehicleDetails.rows[0].daily_rent_price;

  // const first_query = await pool.query(
  //   `INSERT INTO Bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
  //   [
  //     customer_id,
  //     vehicle_id,
  //     rent_start_date,
  //     rent_end_date,
  //     total_price,
  //     status,
  //   ]
  // );

  // let second_query: any;

  // if (first_query.rows.length > 0) {
  //   const availability = {
  //     availability_status: "booked",
  //   };
  //   second_query = await vehicleServices.updateVehicleInfo(
  //     vehicle_id as string,
  //     availability
  //   );
  // }

  // const result = {
  //   ...first_query.rows[0],
  //   vehicle: {
  //     vehicle_name: second_query.rows[0].vehicle_name,
  //     daily_rent_price: second_query.rows[0].daily_rent_price,
  //   },
  // };
  // return result;
};

const viewBookings = async (email: string, role: string) => {
  if (role == "admin") {
    const result = await pool.query(`SELECT * FROM Bookings`);
    return result;
  } else {
    const userId = await pool.query(`SELECT id FROM Users WHERE email=$1`, [
      email,
    ]);

    const result = await pool.query(
      `SELECT * FROM Bookings WHERE customer_id=$1`,
      [userId.rows[0].id]
    );
    return result;
  }
};

const updateBooking = async (
  payload: Record<string, unknown>,
  bookingId: string,
  currentUserEmail: string,
  currentUserRole: string
) => {
  if (currentUserRole == "customer") {
    const findCustomer = await pool.query(
      `SELECT id FROM Users WHERE email=$1`,
      [currentUserEmail]
    );
    const result = await pool.query(
      `UPDATE Bookings SET status=$1 WHERE id=$2 AND customer_id=$3 RETURNING *`,
      [payload?.status, bookingId, findCustomer.rows[0].id]
    );
    if (result.rows.length > 0) {
      const updateVehicle = await pool.query(
        `UPDATE Vehicles SET availability_status=$1 WHERE id=$2`,
        ["available", result.rows[0].vehicle_id]
      );
    }
    return result;
  }

  const result = await pool.query(
    `UPDATE Bookings SET status=$1 WHERE id=$2 RETURNING *`,
    [payload?.status, bookingId]
  );
  if (result.rows.length > 0) {
    const updateVehicle = await pool.query(
      `UPDATE Vehicles SET availability_status=$1 WHERE id=$2 RETURNING availability_status`,
      ["available", result.rows[0].vehicle_id]
    );
    result.rows[0] = { ...result.rows[0], vehicle: updateVehicle.rows[0] };

    return result;
  }
  return result;
};

export const bookingServices = {
  createBooking,
  viewBookings,
  updateBooking,
};
