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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.getAllUser = exports.getUserById = exports.getProfile = exports.adminLogin = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const async_handler_util_1 = __importDefault(require("../utils/async-handler.util"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const bcrypt_util_1 = require("../utils/bcrypt.util");
const jwt_util_1 = require("../utils/jwt.util");
const enums_1 = require("../types/enums");
const pagination_util_1 = require("../utils/pagination.util");
exports.register = (0, async_handler_util_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { password, role } = _a, data = __rest(_a, ["password", "role"]);
    if (!password) {
        throw new error_handler_middleware_1.default('Password is required', 400);
    }
    const hashedPassword = yield (0, bcrypt_util_1.hash)(password);
    const user = yield user_model_1.default.create(Object.assign(Object.assign({}, data), { password: hashedPassword }));
    res.status(201).json({
        success: true,
        status: 'success',
        data: user
    });
}));
exports.login = (0, async_handler_util_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, email } = req.body;
    if (!email) {
        throw new error_handler_middleware_1.default('Email is required', 400);
    }
    if (!password) {
        throw new error_handler_middleware_1.default('Password is required', 400);
    }
    // find user by email => user
    const user = yield user_model_1.default.findOne({ email });
    //if !user -> Invalid email or password
    if (!user) {
        throw new error_handler_middleware_1.default('Invalid email or password', 400);
    }
    // compare user password and  user.password
    const isPasswordMatched = yield (0, bcrypt_util_1.compare)(user.password, password);
    // if -> false => Invalid email or password
    if (!isPasswordMatched) {
        throw new error_handler_middleware_1.default('Invalid email or password', 400);
    }
    const payload = {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        userName: user.userName,
        role: user.role
    };
    const token = (0, jwt_util_1.generateJwtToken)(payload);
    res.status(201).json({
        success: true,
        status: 'success',
        data: user,
        message: 'logged in success',
        access_token: token
    });
}));
exports.adminLogin = (0, async_handler_util_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, email } = req.body;
    if (!email) {
        throw new error_handler_middleware_1.default('Email is required', 400);
    }
    if (!password) {
        throw new error_handler_middleware_1.default('Password is required', 400);
    }
    // find user by email => user
    const user = yield user_model_1.default.findOne({ email });
    //if !user -> Invalid email or password
    if (!user || user.role !== enums_1.Role.Admin) {
        throw new error_handler_middleware_1.default('Invalid email or password', 400);
    }
    // compare user password and  user.password
    const isPasswordMatched = yield (0, bcrypt_util_1.compare)(user.password, password);
    // if -> false => Invalid email or password
    if (!isPasswordMatched) {
        throw new error_handler_middleware_1.default('Invalid email or password', 400);
    }
    const payload = {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        userName: user.userName,
        role: user.role
    };
    const token = (0, jwt_util_1.generateJwtToken)(payload);
    res.status(201).json({
        success: true,
        status: 'success',
        data: user,
        message: 'logged in success',
        access_token: token
    });
}));
exports.getProfile = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user._id;
    const profile = yield user_model_1.default.findById(id).select('-password');
    if (!profile) {
        throw new error_handler_middleware_1.default('Profile not found', 404);
    }
    res.status(200).json({
        success: true,
        message: 'Profile fetched',
        data: profile,
        status: 'success'
    });
}));
exports.getUserById = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_model_1.default.findById(id).select('-password');
    if (!user) {
        throw new error_handler_middleware_1.default('User not found', 404);
    }
    res.status(200).json({
        success: true,
        message: 'User fetched',
        data: user,
        status: 'success'
    });
}));
exports.getAllUser = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const limit = (_a = parseInt(req.params.perPage)) !== null && _a !== void 0 ? _a : 10;
    const page = (_b = parseInt(req.params.page)) !== null && _b !== void 0 ? _b : 1;
    const skip = (page - 1) * limit;
    const users = yield user_model_1.default.find({}).select('-password').limit(limit).skip(skip);
    const total = yield user_model_1.default.countDocuments();
    const pagination = (0, pagination_util_1.getPagination)(total, page, limit);
    res.status(200).json({
        success: true,
        message: 'User fetched',
        data: {
            data: users,
            pagination
        },
        status: 'success'
    });
}));
exports.remove = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield user_model_1.default.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        message: 'User deleted',
        data: null,
        status: 'success'
    });
}));
