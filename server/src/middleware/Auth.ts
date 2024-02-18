import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import {UserModel,User} from '../models/UserModel';
import { HttpStatusCodes } from '../config/httpCodes';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the token from the request header
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            throw new Error('Authorization token not provided');
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'recipe') as { _id: string };

        // Find the user by ID
        const user: User | null = await UserModel.findById(decoded._id);
        if (!user) {
            throw new Error('User not found');
        }

        // Attach the user to the request object for future use
        //@ts-ignore
        req.user = user;

        // Call next to proceed to the next middleware or route handler
        next();
    } catch (err:any) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized',message:err.message });
    }
};

export default authMiddleware;
