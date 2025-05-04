"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enums_1 = require("../types/enums");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'User already exists with provided email'],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address',]
    },
    role: {
        type: String,
        enum: Object.values(enums_1.Role),
        default: enums_1.Role.User,
        required: true
    },
    fullName: {
        type: String,
        required: [true, 'Name is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    userName: {
        type: String,
        required: [true, 'Username is required'],
    }
}, { timestamps: true });
const User = (0, mongoose_1.model)('user', userSchema);
exports.default = User;
