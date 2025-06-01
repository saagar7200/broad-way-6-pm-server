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
exports.remove = exports.getAll = exports.getById = exports.getByUserId = exports.update = exports.create = void 0;
const async_handler_util_1 = __importDefault(require("../utils/async-handler.util"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const user_model_1 = __importDefault(require("../models/user.model"));
const category_model_1 = __importDefault(require("../models/category.model"));
exports.create = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const userId = req.user._id;
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        throw new error_handler_middleware_1.default('User not found', 404);
    }
    const category = yield category_model_1.default.create({ name, user: user._id });
    if (!category) {
        throw new error_handler_middleware_1.default('Category not created.', 401);
    }
    res.status(201).json({
        message: 'Category created',
        data: category,
        success: true,
        status: 'success'
    });
}));
exports.update = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const { id } = req.params;
    const userId = req.user._id;
    if (!name) {
        throw new error_handler_middleware_1.default('Category name  is required', 400);
    }
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        throw new error_handler_middleware_1.default('User not found', 404);
    }
    const category = yield category_model_1.default.findById(id);
    if (!category) {
        throw new error_handler_middleware_1.default('Category not found.', 404);
    }
    if (category.user !== user._id) {
        throw new error_handler_middleware_1.default('Only category owner can perform this operation.', 403);
    }
    category.name = name;
    const updatedCategory = yield category.save();
    res.status(201).json({
        message: 'Category updated',
        data: updatedCategory,
        success: true,
        status: 'success'
    });
}));
exports.getByUserId = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const categories = yield category_model_1.default.find({ user: userId });
    res.status(201).json({
        message: 'Category by user Id',
        data: categories,
        success: true,
        status: 'success'
    });
}));
exports.getById = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { id } = req.params;
    const category = yield category_model_1.default.findOne({ _id: id, user: userId });
    if (!category) {
        throw new error_handler_middleware_1.default('Category not found', 404);
    }
    res.status(201).json({
        message: 'Category by user Id',
        data: category,
        success: true,
        status: 'success'
    });
}));
exports.getAll = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield category_model_1.default.find({});
    res.status(201).json({
        message: 'All categories fetched',
        data: categories,
        success: true,
        status: 'success'
    });
}));
exports.remove = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user._id;
    const { categoryId } = req.params;
    const category = yield category_model_1.default.findById(categoryId);
    if (!category) {
        throw new error_handler_middleware_1.default('Category not found', 404);
    }
    if (category.user.toString() !== user.toString()) {
        throw new error_handler_middleware_1.default('You can not perform this action', 403);
    }
    yield category.deleteOne();
    res.status(201).json({
        message: 'Category deleted',
        data: null,
        success: true,
        status: 'success'
    });
}));
