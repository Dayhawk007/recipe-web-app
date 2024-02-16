import express from 'express';
import bcrypt from 'bcrypt';
import UserModel from "../models/UserModel"
import { HttpStatusCodes } from '../config/httpCodes';
import { signIn, signUp } from '../controllers/UserController';

const router = express.Router();

router.post('/sign-up',signUp);

router.post('/sign-in', signIn);

export {router as UserRouter}
