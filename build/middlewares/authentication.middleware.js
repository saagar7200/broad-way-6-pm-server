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
exports.Authenticate = void 0;
const error_handler_middleware_1 = __importDefault(require("./error-handler.middleware"));
const jwt_util_1 = require("../utils/jwt.util");
const user_model_1 = __importDefault(require("../models/user.model"));
const Authenticate = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // get authorization header
            const auth_header = req.headers['authorization'];
            if (!auth_header) {
                throw new error_handler_middleware_1.default('Authorization header is missing', 401);
            }
            if (!auth_header.startsWith('BEARER')) {
                throw new error_handler_middleware_1.default('Unauthorized, access denied', 401);
            }
            //  get token 
            const token = auth_header.split(' ')[1];
            if (!token) {
                throw new error_handler_middleware_1.default('Unauthorized, access denied', 401);
            }
            //  verify token
            const decoded = (0, jwt_util_1.verifyJwtToken)(token);
            if (!decoded) {
                throw new error_handler_middleware_1.default('Access token is expired or malformed, access denied', 400);
            }
            //  expiry of token
            if ((decoded === null || decoded === void 0 ? void 0 : decoded.exp) && decoded.exp * 1000 < Date.now()) {
                throw new error_handler_middleware_1.default('Access token is expired, access denied', 400);
            }
            //  search for user
            const user = yield user_model_1.default.findById(decoded._id);
            if (!user) {
                throw new error_handler_middleware_1.default('Unauthorized, access denied', 401);
            }
            //  check for authorized role
            if (roles && !roles.includes(user.role)) {
                throw new error_handler_middleware_1.default('Forbidden, access denied', 403);
            }
            req.user = {
                _id: decoded._id,
                email: decoded.email,
                fullName: decoded.fullName,
                role: decoded.role,
                userName: decoded.userName
            };
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.Authenticate = Authenticate;
