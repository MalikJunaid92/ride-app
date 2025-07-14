import express from "express";
import { registerUser, signupNewUser, verifyOtp } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/registeration", registerUser);  // login user
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/sign-up-user", signupNewUser);  // signup user


export default userRouter;