import express from 'express'
import { createRecipe, searchRecipeWithIngredients,getRecipeById } from '../controllers/RecipeController';

const router=express.Router();

router.post("/",createRecipe)

router.post("/searchRecipe",searchRecipeWithIngredients);

router.get("/:id",getRecipeById)

export {router as RecipeRouter}
