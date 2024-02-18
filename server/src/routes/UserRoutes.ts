import express from 'express';
import bcrypt from 'bcrypt';
import {UserModel} from "../models/UserModel"
import { HttpStatusCodes } from '../config/httpCodes';
import { getUserInfo, signIn, signUp } from '../controllers/UserController';
import authMiddleware from '../middleware/Auth';

const router = express.Router();

router.post('/sign-up',signUp);

router.post('/sign-in', signIn);

router.get("/user-info",authMiddleware,getUserInfo)

export {router as UserRouter}
