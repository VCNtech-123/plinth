import { Request, Response } from "express";
import { registerUser, loginUser, getCurrentUserService } from './auth.service';
import { generateToken } from '../../utils/generateToken';
import { CookieOptions } from "express";

export const register = async (req: Request, res: Response) => {

    const { name, email, password } = req.body;
    const user = await registerUser(name, email, password);

    res.status(201).json({
        status: "success",
        data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        },
    });
};

export const login = async (req: Request, res: Response) => {

    const { email, password } = req.body;
    const user = await loginUser(email, password);
    const token = generateToken(user._id.toString());

    const isProd = process.env.NODE_ENV === "production";

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: isProd,                    
      sameSite: isProd ? "none" : "lax", 
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions)

     res.status(200).json({
        status: "success",
        token,
        data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        },
    });
}

export const logout = async (req: Request, res: Response) => {
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

export const getCurrentUser = async (
  req: Request,
  res: Response
) => {
  
  const user = await getCurrentUserService(req.user!._id)

  res.status(200).json({
    status: "success",
    data: { user }
  })
}