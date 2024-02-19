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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = exports.signIn = exports.signUp = void 0;
const UserModel_1 = require("../models/UserModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const httpCodes_1 = require("../config/httpCodes");
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const existingUser = yield UserModel_1.UserModel.findOne({ email });
        if (existingUser) {
            return res.status(httpCodes_1.HttpStatusCodes.BAD_REQUEST).json({ error: 'Email already exists' });
        }
        const user = new UserModel_1.UserModel({ username, email, password });
        yield user.save();
        const token = user.generateAuthToken();
        console.log("User Signed up " + user);
        return res.status(httpCodes_1.HttpStatusCodes.CREATED).json({ user, token });
    }
    catch (err) {
        return res.status(httpCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield UserModel_1.UserModel.findOne({ email });
        if (!user) {
            return res.status(httpCodes_1.HttpStatusCodes.UNAUTHORIZED).json({ error: 'Invalid email or password' });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(httpCodes_1.HttpStatusCodes.UNAUTHORIZED).json({ error: 'Invalid email or password' });
        }
        const token = user.generateAuthToken();
        console.log("User logged in " + user);
        return res.status(httpCodes_1.HttpStatusCodes.OK).json({ user, token });
    }
    catch (err) {
        return res.status(httpCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
});
exports.signIn = signIn;
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const user = req.user;
    try {
        if (!user) {
            return res.status(httpCodes_1.HttpStatusCodes.NOT_FOUND).send({
                "message": "User not found/Auth invalid"
            });
        }
        else {
            return res.status(httpCodes_1.HttpStatusCodes.OK).send(user);
        }
    }
    catch (err) {
        return res.status(httpCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
            "message": err.message
        });
    }
});
exports.getUserInfo = getUserInfo;
