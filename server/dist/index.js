"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const UserRoutes_1 = require("./src/routes/UserRoutes");
const RecipeRoute_1 = require("./src/routes/RecipeRoute");
const IngredientsRoute_1 = require("./src/routes/IngredientsRoute");
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const MONGO_DB_URI = process.env.MONGO_DB_URI || "mongodb://127.0.0.1:27017/recipe-app";
// Create Express app
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/user", UserRoutes_1.UserRouter);
app.use("/api/recipe", RecipeRoute_1.RecipeRouter);
app.use("/api/ingredients", IngredientsRoute_1.IngredientsRouter);
// Start the server
// Connect to MongoDB
mongoose_1.default.connect(MONGO_DB_URI)
    .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
});
