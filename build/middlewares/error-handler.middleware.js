"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
        this.success = false;
        this.isOperation = true;
        Error.captureStackTrace(this, CustomError);
    }
}
const errorHandler = (err, req, res, next) => {
    var _a;
    const success = err.success || false;
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    const message = (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : 'Something went wrong';
    console.log("👊 ~ error-handler.middleware.ts:31 ~ errorHandler ~ err:", err);
    res.status(statusCode).json({
        success,
        status,
        message
    });
};
exports.errorHandler = errorHandler;
exports.default = CustomError;
