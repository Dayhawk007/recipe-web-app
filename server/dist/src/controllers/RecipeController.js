"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecipeById = exports.searchRecipeWithIngredients = exports.createRecipe = void 0;
const RecipeModel_1 = require("../models/RecipeModel");
const httpCodes_1 = require("../config/httpCodes");
const createRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, ingredients, instructions, cookingTime } = req.body;
        const newRecipe = new RecipeModel_1.RecipeModel({
            title,
            description,
            ingredients,
            instructions,
            cookingTime
        });
        yield newRecipe.save();
        res.status(httpCodes_1.HttpStatusCodes.CREATED).json(newRecipe);
    }
    catch (err) {
        console.error('Failed to create recipe:', err);
        res.status(httpCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create recipe' });
    }
});
exports.createRecipe = createRecipe;
const searchRecipeWithIngredients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchIngredients = req.body.searchIngredients;
    if (searchIngredients === undefined) {
        return res.status(httpCodes_1.HttpStatusCodes.BAD_REQUEST).send({
            "message": "No search ingredients"
        });
    }
    const pipeline = [
        {
            $match: {
                'ingredients.name': { $all: searchIngredients }
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
            $sort: {
                matchedIngredientsCount: -1
            }
        },
    ];
    //@ts-ignore
    const recipes = yield RecipeModel_1.RecipeModel.aggregate(pipeline);
    return res.status(httpCodes_1.HttpStatusCodes.OK).send(recipes);
});
exports.searchRecipeWithIngredients = searchRecipeWithIngredients;
const getRecipeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id || "";
        if (id === "") {
            return res.status(httpCodes_1.HttpStatusCodes.BAD_REQUEST).send({
                "message": "Id cannot be empty"
            });
        }
        const recipe = yield RecipeModel_1.RecipeModel.findById(id);
        if (recipe === undefined) {
            return res.status(httpCodes_1.HttpStatusCodes.NOT_FOUND).send({
                "message": "Recipe not found for ID"
            });
        }
        return res.status(httpCodes_1.HttpStatusCodes.OK).send(recipe);
    }
    catch (error) {
        return res.status(httpCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
            "message": error.message
        });
    }
});
exports.getRecipeById = getRecipeById;
