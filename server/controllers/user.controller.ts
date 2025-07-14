require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import twilio from "twilio";
import prisma from "../utils/prisma";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken, {
  lazyLoading: true,
});

// register user
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone_number } = req.body;
    try {
      await client.verify.v2
        ?.services(process.env.TWILIO_SERVICE_SID!)
        .verifications.create({
          channel: "sms",
          to: phone_number,
        });

      res.status(201).json({
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
    });
  }
};

// verify Otp

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone_number, otp } = req.body;

    try {
      await client.verify.v2
        .services(process.env.TWILIO_SERVICE_SID!)
        .verificationChecks.create({
          to: phone_number,
          code: otp,
        });
      // is user exist
      const isUserExist = await prisma.user.findUnique({
        where: {
          phone_number,
        },
      });
      if (isUserExist) {
      } else {
        // create account
        const user = await prisma.user.create({
          data: {
            phone_number: phone_number,
          },
        });
        res.status(200).json({
          success: true,
          message: "OTP verified successfully!",
          user: user,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        success: false,
        message: "Something went wrong!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
    });
  }
};

// sigup new user

export const signupNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, name, email } = req.body;
    // check if user exist
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (user?.email === null) {
      // update user
      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          name,
          email,
        },
      });
      res.status(201).json({
        success: true,
        user: updatedUser,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "User already exists!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
