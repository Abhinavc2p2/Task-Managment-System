import express from "express";
import { registerUser,loginUser , refreshToken,
  logoutUser,  } from "../controllers/auth.controller";

const router = express.Router();

//Authentcation api
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);



export default router;