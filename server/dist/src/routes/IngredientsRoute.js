"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngredientsRouter = void 0;
const express_1 = __importDefault(require("express"));
const IngredientController_1 = require("../controllers/IngredientController");
const router = express_1.default.Router();
exports.IngredientsRouter = router;
router.get("/search", IngredientController_1.searchIngredient);
