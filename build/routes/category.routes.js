"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const authentication_middleware_1 = require("../middlewares/authentication.middleware");
const enums_1 = require("../types/enums");
const router = express_1.default.Router();
router.get('/', (0, authentication_middleware_1.Authenticate)([enums_1.Role.Admin]), category_controller_1.getAll);
router.post('/', (0, authentication_middleware_1.Authenticate)([enums_1.Role.User]), category_controller_1.create);
router.put('/:id', (0, authentication_middleware_1.Authenticate)([enums_1.Role.User]), category_controller_1.update);
router.get('/all/user', (0, authentication_middleware_1.Authenticate)([enums_1.Role.User]), category_controller_1.getByUserId);
router.get('/:id', (0, authentication_middleware_1.Authenticate)([enums_1.Role.User]), category_controller_1.getById);
router.delete('/:categoryId', (0, authentication_middleware_1.Authenticate)([enums_1.Role.User]), category_controller_1.remove);
exports.default = router;
