import { Request, Response } from "express";
import { HttpStatusCodes } from "../config/httpCodes";
import { RecipeModel } from "../models/RecipeModel";


export const searchIngredient = async(req:Request,res:Response)=>{
    const searchTerm=req.query.searchTerm || "";

    console.log("Search term : ",searchTerm)

    if(searchTerm===""){
        return res.status(HttpStatusCodes.BAD_REQUEST).send(
            {
                "message":"Search term cannot be empty"
            }
        )
    }
    const regexPattern = new RegExp(searchTerm as string, 'i');
    const pipeline = [
        {
            $unwind: '$ingredients' 
        },
        {
            $match: {
                'ingredients.name': { $regex: regexPattern } 
            }
        },
        {
            $group: {
                _id: null,
                ingredients: { $addToSet: {
                    name:"$ingredients.name",
                    image:"$ingredients.image"
                } } 
            }
        },
        {
            $project: {
                _id: 0,
                ingredients: 1 
            }
        }
    ];

    const resultIngredients=await RecipeModel.aggregate(pipeline);

    console.log(resultIngredients);

    if(resultIngredients.length===0){
        return res.status(HttpStatusCodes.NO_CONTENT).send(
            {
                "message":"No results found"
            }
        )
    }

    return res.status(HttpStatusCodes.OK).send(resultIngredients)

}