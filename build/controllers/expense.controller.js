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
exports.getAll = exports.getById = exports.getByUserId = exports.remove = exports.update = exports.create = void 0;
const async_handler_util_1 = __importDefault(require("../utils/async-handler.util"));
const expense_model_1 = __importDefault(require("../models/expense.model"));
const category_model_1 = __importDefault(require("../models/category.model"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const cloudinary_config_1 = require("../config/cloudinary.config");
const send_mail_1 = require("../utils/send-mail");
exports.create = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = req.user._id;
    const _b = req.body, { categoryId } = _b, data = __rest(_b, ["categoryId"]);
    const receipts = req.files;
    const expense = new expense_model_1.default(data);
    expense.createdBy = user;
    const category = yield category_model_1.default.findById(categoryId);
    if (!category) {
        throw new error_handler_middleware_1.default('Category not found', 404);
    }
    expense.category = category._id;
    if (receipts && receipts.length > 0) {
        receipts.forEach(receipt => {
            expense.receipts.push({
                public_id: receipt.filename,
                path: receipt.path
            });
        });
    }
    yield expense.save();
    const html = `
    <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #ccc; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
      <h2 style="color: #2e7d32; border-bottom: 2px solid #4caf50; padding-bottom: 8px;">Expense Added Successfully</h2>
      <p style="font-size: 16px;">Hello <strong>${(_a = req.user.fullName) !== null && _a !== void 0 ? _a : 'User'}</strong>,</p>
      <p style="font-size: 15px;">Your expense has been recorded. Here are the details:</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr>
          <th style="text-align: left; background-color: #e0e0e0; padding: 8px; border: 1px solid #ccc;">Title</th>
          <td style="padding: 8px; border: 1px solid #ccc;">${expense.title}</td>
        </tr>
        <tr>
          <th style="text-align: left; background-color: #e0e0e0; padding: 8px; border: 1px solid #ccc;">Amount</th>
          <td style="padding: 8px; border: 1px solid #ccc;">Rs. ${expense.amount}</td>
        </tr>
        <tr>
          <th style="text-align: left; background-color: #e0e0e0; padding: 8px; border: 1px solid #ccc;">Category</th>
          <td style="padding: 8px; border: 1px solid #ccc;">${category.name}</td>
        </tr>
        <tr>
          <th style="text-align: left; background-color: #e0e0e0; padding: 8px; border: 1px solid #ccc;">Created At</th>
          <td style="padding: 8px; border: 1px solid #ccc;">
            ${new Date(expense.createdAt).toLocaleDateString('en-us', {
        day: 'numeric',
        weekday: 'short',
        month: 'long',
        year: 'numeric'
    })}
          </td>
        </tr>
      </table>
      <p style="font-size: 14px; color: #777; margin-top: 20px;">Thank you for using our expense tracker! to update it <a target='__blank' href='http://localhost:8000'>click here</a></p>
    </div>
  `;
    const text = `New Expense is recorded: ${expense.title}, by ${req.user.fullName} at 
        ${new Date(expense.createdAt).toLocaleDateString('en-us', {
        day: 'numeric',
        weekday: 'short',
        month: 'long',
        year: 'numeric'
    })}`;
    yield (0, send_mail_1.sendMail)({
        to: req.user.email,
        subject: 'New Expense Recorded.',
        html: html
    });
    res.status(201).json({
        data: expense,
        success: true,
        status: 'success',
        message: 'Expense created'
    });
}));
exports.update = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // const session = await mongoose.startSession()
    // session.startTransaction()
    try {
        const user = req.user._id;
        const { categoryId, deletedReceipts, title, date, amount, description } = req.body;
        const { id } = req.params;
        const receipts = req.files;
        const expense = yield expense_model_1.default.findOne({ _id: id, createdBy: user });
        if (!expense) {
            throw new error_handler_middleware_1.default('Expense not found', 404);
        }
        if (title)
            expense.title = title;
        if (date)
            expense.date = date;
        if (amount)
            expense.amount = amount;
        if (description)
            expense.description = description;
        if (categoryId) {
            const category = yield category_model_1.default.findById(categoryId);
            if (!category) {
                throw new error_handler_middleware_1.default('Category not found', 404);
            }
            expense.category = category._id;
        }
        if (receipts && receipts.length > 0) {
            receipts.forEach(receipt => {
                expense.receipts.push({
                    public_id: receipt.filename,
                    path: receipt.path
                });
            });
        }
        if (deletedReceipts) {
            const fileToDelete = JSON.parse(deletedReceipts);
            if (Array.isArray(fileToDelete) && fileToDelete.length > 0) {
                const filteredReceipts = expense.receipts.filter((receipt) => !fileToDelete.includes(receipt.public_id));
                expense.set('receipts', filteredReceipts);
                yield (0, cloudinary_config_1.deleteFiles)(fileToDelete);
            }
        }
        yield expense.save();
        // await session.commitTransaction()
        // session.endSession()
        res.status(201).json({
            data: expense,
            success: true,
            status: 'success',
            message: 'Expense updated'
        });
    }
    catch (error) {
        // await session.abortTransaction()
        // session.endSession()
        throw new error_handler_middleware_1.default((_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : 'Fail to update expense', 500);
    }
}));
exports.remove = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.user._id;
    const expense = yield expense_model_1.default.findById(id);
    if (!expense) {
        throw new error_handler_middleware_1.default('Expense not found', 404);
    }
    if (expense.createdBy !== userId) {
        throw new error_handler_middleware_1.default('Only owner can perform this operation', 400);
    }
    if (expense.receipts) {
        yield (0, cloudinary_config_1.deleteFiles)(expense.receipts.map(receipt => receipt.public_id));
    }
    yield expense.deleteOne();
    res.status(200).json({
        success: true,
        status: 'success',
        message: 'expense deleted'
    });
}));
exports.getByUserId = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const expenses = yield expense_model_1.default.find({ createdBy: userId }).populate('category');
    res.status(201).json({
        message: 'expense by user Id',
        data: expenses,
        success: true,
        status: 'success'
    });
}));
exports.getById = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { id } = req.params;
    const expense = yield expense_model_1.default.findOne({ _id: id, createdBy: userId }).populate('createdBy');
    if (!expense) {
        throw new error_handler_middleware_1.default('expense not found', 404);
    }
    res.status(201).json({
        message: 'expense by user Id',
        data: expense,
        success: true,
        status: 'success'
    });
}));
exports.getAll = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const expenses = yield expense_model_1.default.find({});
    res.status(201).json({
        message: 'All expenses fetched',
        data: expenses,
        success: true,
        status: 'success'
    });
}));
