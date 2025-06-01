"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expense_controller_1 = require("../controllers/expense.controller");
const authentication_middleware_1 = require("../middlewares/authentication.middleware");
const enums_1 = require("../types/enums");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = express_1.default.Router();
const upload = (0, upload_middleware_1.uploader)();
router.post('/', (0, authentication_middleware_1.Authenticate)([enums_1.Role.User]), upload.array('receipts', 3), expense_controller_1.create);
router.put('/:id', (0, authentication_middleware_1.Authenticate)([enums_1.Role.User]), upload.array('receipts', 3), expense_controller_1.update);
router.get('/user/', (0, authentication_middleware_1.Authenticate)([enums_1.Role.User]), expense_controller_1.getByUserId);
router.get('/:id', (0, authentication_middleware_1.Authenticate)([enums_1.Role.User, enums_1.Role.Admin]), expense_controller_1.getById);
router.get('/', (0, authentication_middleware_1.Authenticate)([enums_1.Role.Admin]), expense_controller_1.getAll);
// router.delete('/:id',Authenticate([Role.User]),remove)
exports.default = router;
