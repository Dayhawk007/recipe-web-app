import express from "express"
import { searchIngredient } from "../controllers/IngredientController"

const router=express.Router()

router.get("/search",searchIngredient);

export {router as IngredientsRouter}