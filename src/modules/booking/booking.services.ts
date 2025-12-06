import { pool } from "../../config/db";
import { vehicleServices } from "../vehicle/vehicle.services";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
  const status = "active";

  const vehicleDetails = await vehicleServices.getSingleVehicle(
    vehicle_id as string
  );

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
  const total_price = totalDays * vehicleDetails.rows[0].daily_rent_price;

  const first_query = await pool.query(
    `INSERT INTO Bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status,
    ]
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
};

export const bookingServices = {
  createBooking,
};
