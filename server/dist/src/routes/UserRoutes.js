"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../controllers/UserController");
const Auth_1 = __importDefault(require("../middleware/Auth"));
const router = express_1.default.Router();
exports.UserRouter = router;
router.post('/sign-up', UserController_1.signUp);
router.post('/sign-in', UserController_1.signIn);
router.get("/user-info", Auth_1.default, UserController_1.getUserInfo);
