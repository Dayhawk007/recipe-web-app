import express from 'express'
import { createRecipe, searchRecipeWithIngredients } from '../controllers/RecipeController';

const router=express.Router();

router.post("/",createRecipe)

router.post("/searchRecipe",searchRecipeWithIngredients);

export {router as RecipeRouter}
