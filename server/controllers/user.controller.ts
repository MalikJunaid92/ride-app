require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import twilio from "twilio";
import prisma from "../utils/prisma";
import jwt from "jsonwebtoken";
import { nylas } from "../app";
import { sendToken } from "../utils/send-token";

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
        await sendToken(isUserExist, res);
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

// sending otp to email
export const sendingOTPtoEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, name, userId } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const users = {
      userId,
      name,
      email,
    };
    const token = jwt.sign(
      {
        users,
        otp,
      },
      process.env.EMAIL_ACTIVATION_SECRET!,
      {
        expiresIn: "10m",
      }
    );
    try {
      await nylas.messages.send({
        identifier: process.env.USER_GRANT_ID!,
        requestBody: {
          to: [{ name: name, email: email }],
          subject: "Verify your email address!",
          body: `
          <p>Hi ${name},</p>
      <p>Your Ridewave verification code is ${otp}. If you didn't request for this OTP, please ignore this email!</p>
      <p>Thanks,<br>Ridewave Team</p>
          `,
        },
      });
    } catch (error) {
      console.log(error);
    }
    res.status(201).json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Failed to send OTP to email.",
    });
  }
};

// verifying email otp
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { otp, token } = req.body;
    const newUser = jwt.verify(
      token,
      process.env.EMAIL_ACTIVATION_SECRET!
    ) as any;
    if (newUser.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid token.",
      });
    }
    const { name, email, userId } = newUser.users;
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
      await sendToken(updatedUser, res);
    } else {
      res.status(400).json({
        success: false,
        message: "User already exists!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Your otp is expired!",
    });
  }
};
