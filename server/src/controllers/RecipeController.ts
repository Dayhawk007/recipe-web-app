import { Request, Response } from "express";
import { Recipe,RecipeModel } from "../models/RecipeModel";
import { HttpStatusCodes } from "../config/httpCodes";

export const createRecipe=async(req:Request,res:Response)=>{
    try {
        const { title, description, ingredients, instructions, cookingTime } = req.body;

        const newRecipe: Recipe = new RecipeModel({
            title,
            description,
            ingredients,
            instructions,
            cookingTime
        });

        await newRecipe.save();

        res.status(HttpStatusCodes.CREATED).json(newRecipe);
    } catch (err:any) {
        console.error('Failed to create recipe:', err);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create recipe' });
    }
}