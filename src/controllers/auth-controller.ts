import { Request, Response } from "express";

export const checkAuth = (req: Request, res: Response) => {
  res.json({
    email: req.user?.email,
    displayName: req.user?.displayName,
    avatar: req.user?.avatar,
    id: req.user?.googleId,
  });
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("connect.sid");
  res.status(200).json({ message: "Logout successful" });
};
