import express from "express";
import { registerUser, sendingOTPtoEmail,verifyEmail,verifyOtp } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/registeration", registerUser);  // login user
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/email-otp-request", sendingOTPtoEmail);  
userRouter.put("/email-otp-verify", verifyEmail);  


export default userRouter;