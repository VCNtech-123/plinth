import { Request, Response } from "express";
import { registerUser, loginUser } from './auth.service';
import { generateToken } from '../../utils/generateToken';

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

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // use "strict" in production if same domain
        maxAge: 1000 * 60 * 60, // 1 hour
        });
        
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