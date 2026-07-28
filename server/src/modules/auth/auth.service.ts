import { User } from "../user/user.model";
import { ApiError } from '../../utils/ApiError';
import { Types } from 'mongoose'

export const registerUser = async ( 
    name: string,
    email: string,
    password: string
) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(401, 'Email already registered!');
    }

    const user = await User.create({
        name,
        email,
        password
    });

    return user;
}

export const loginUser = async (
    email: string,
    password: string
) => {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        throw new ApiError(401, 'Invalid email or password')
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new ApiError(401, 'Invalid email or password')
    }

    return user;
}

export const getCurrentUserService = async (userId: Types.ObjectId ) => {
    const user = await User.findById(userId)
                .select("_id name email")
                .lean();

    if (!user) {
        throw new ApiError(401, 'No user found')
    }

    return user
}