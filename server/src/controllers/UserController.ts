import { Request,Response } from "express"
import {UserModel} from "../models/UserModel";
import bcrypt from 'bcrypt'
import { HttpStatusCodes } from "../config/httpCodes";

export const signUp=async(req:Request,res:Response)=>{
    try {
        const { username, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
    
        if (existingUser) {
          return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: 'Email already exists' });
        }
    
        const user = new UserModel({ username, email, password });
        await user.save();
    
        const token = user.generateAuthToken();
        console.log("User Signed up "+user)
        return res.status(HttpStatusCodes.CREATED).json({ user, token });
      } catch (err:any) {
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
}

export const signIn= async(req:Request,res:Response)=>{
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
    
        if (!user) {
          return res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: 'Invalid email or password' });
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) {
          return res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: 'Invalid email or password' });
        }
    
        const token = user.generateAuthToken();
        console.log("User logged in "+user)
        return res.status(HttpStatusCodes.OK).json({ user, token });
      } catch (err:any) {
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
}

export const getUserInfo=async(req:Request,res:Response)=>{
  //@ts-ignore
  const user=req.user;

  try{
    if(!user){
      return res.status(HttpStatusCodes.NOT_FOUND).send({
        "message":"User not found/Auth invalid"
      })
    }
    else{
      return res.status(HttpStatusCodes.OK).send(user);
    }
  }
  catch(err:any){
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
      "message":err.message
    })
  }
}