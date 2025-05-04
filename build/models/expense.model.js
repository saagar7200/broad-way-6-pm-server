"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const today = new Date().toISOString().split('T')[0];
const expenseSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Expense title is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Expense amount is required'],
    },
    date: {
        type: Date,
        default: today
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'User is required'],
        ref: 'user'
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'Category is required'],
        ref: 'category'
    },
    receipts: [
        {
            path: {
                type: String,
                required: true
            },
            public_id: {
                type: String,
                required: true
            }
        }
    ]
}, { timestamps: true });
const Expense = (0, mongoose_1.model)('expense', expenseSchema);
exports.default = Expense;
