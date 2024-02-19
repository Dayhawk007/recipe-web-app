"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeRouter = void 0;
const express_1 = __importDefault(require("express"));
const RecipeController_1 = require("../controllers/RecipeController");
const router = express_1.default.Router();
exports.RecipeRouter = router;
router.post("/", RecipeController_1.createRecipe);
router.post("/searchRecipe", RecipeController_1.searchRecipeWithIngredients);
router.get("/:id", RecipeController_1.getRecipeById);
