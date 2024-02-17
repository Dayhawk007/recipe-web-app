import { Request, Response } from "express";
import { Recipe,RecipeModel} from "../models/RecipeModel";
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


export const searchRecipeWithIngredients= async(req:Request,res:Response) => {
    
    const searchIngredients=req.body.searchIngredients;

    if(searchIngredients===undefined){
        return res.status(HttpStatusCodes.BAD_REQUEST).send({
            "message":"No search ingredients"
        })
    }

    const pipeline = [
        {
            $match: {
                'ingredients.name': { $all: searchIngredients } // Match recipes where ingredients array contains all search ingredients
            }
        },
        {
            $addFields: {
                matchedIngredients: {
                    $setIntersection: ['$ingredients.name', searchIngredients]
                }
            }
        },
        {
            $match: {
                matchedIngredients: { $size: searchIngredients.length }
            }
        },
        {
            $project: {
                title: 1,
                description: 1,
                ingredients: 1,
                instructions: 1,
                cookingTime: 1,
                matchedIngredients: 1
            }
        },
        {
            $addFields: {
                matchedIngredientsCount: { $size: '$matchedIngredients' }
            }
        },
        {
            $sort:{
                matchedIngredientsCount:-1
            }
        },
    ];
    
    //@ts-ignore
    const recipes=await RecipeModel.aggregate(pipeline);

    

    return res.status(HttpStatusCodes.OK).send(recipes);

}
