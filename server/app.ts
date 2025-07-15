require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route";
import Nylas from "nylas";
export const app = express();

export const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_KEY!,
})
// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// routes
app.use("/api/v1", userRouter);

// testing api
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the Ride App API",
  });
});
