"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const authentication_middleware_1 = require("../middlewares/authentication.middleware");
const enums_1 = require("../types/enums");
const router = express_1.default.Router();
router.post('/register', user_controller_1.register);
router.post('/login', user_controller_1.login);
router.post('/admin/login', user_controller_1.adminLogin);
router.get('/', (0, authentication_middleware_1.Authenticate)([enums_1.Role.Admin]), user_controller_1.getAllUser);
router.delete('/:id', (0, authentication_middleware_1.Authenticate)([enums_1.Role.Admin]), user_controller_1.remove);
router.get('/profile', (0, authentication_middleware_1.Authenticate)([enums_1.Role.User]), user_controller_1.getProfile);
exports.default = router;
