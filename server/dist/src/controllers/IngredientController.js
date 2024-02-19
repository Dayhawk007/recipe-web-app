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
exports.searchIngredient = void 0;
const httpCodes_1 = require("../config/httpCodes");
const RecipeModel_1 = require("../models/RecipeModel");
const searchIngredient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchTerm = req.query.searchTerm || "";
    console.log("Search term : ", searchTerm);
    const regexPattern = new RegExp(searchTerm, 'i');
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
                        name: "$ingredients.name",
                        image: "$ingredients.image"
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
    const resultIngredients = yield RecipeModel_1.RecipeModel.aggregate(pipeline);
    console.log(resultIngredients);
    if (resultIngredients.length === 0) {
        return res.status(httpCodes_1.HttpStatusCodes.NO_CONTENT).send({
            "message": "No results found"
        });
    }
    return res.status(httpCodes_1.HttpStatusCodes.OK).send(resultIngredients);
});
exports.searchIngredient = searchIngredient;
