"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'User is required']
    }
}, { timestamps: true });
const Category = (0, mongoose_1.model)('category', categorySchema);
exports.default = Category;
