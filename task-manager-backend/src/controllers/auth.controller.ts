import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";


export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2. check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 3. hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // 5. response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    

    // 2. find user
    const user = await prisma.user.findUnique({
      where: { email },
    });
    

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 3. compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 4. generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // save refresh token in DB
await prisma.user.update({
  where: { id: user.id },
  data: { refreshToken },
});

    // 5. response
    res.json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

import jwt from "jsonwebtoken";

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    // verify token
    const decoded = jwt.verify(refreshToken, "refresh_secret") as {
      userId: string;
    };

    // find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // generate new access token
    const newAccessToken = jwt.sign(
      { userId: user.id },
      "access_secret",
      { expiresIn: "15m" }
    );

    res.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
};