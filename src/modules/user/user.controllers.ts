// import { Request, Response } from "express";
// import { userServices } from "./user.services";

// const createUser = async (req: Request, res: Response) => {
//   try {
//     const result = await userServices.createUser(req.body);
//     res.status(201).json({
//       success: true,
//       message: "User created successfully",
//       data: result.rows[0],
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const userControllers = {
//   createUser,
// };
