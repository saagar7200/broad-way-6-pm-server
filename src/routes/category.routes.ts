
import express from 'express'
import { create,getAll,getById,getByUserId,remove,update } from '../controllers/category.controller';
import {Authenticate} from '../middlewares/authentication.middleware'
import { Role } from '../types/enums';
const router = express.Router();

router.get('/',Authenticate([Role.Admin]), getAll)
router.post('/',Authenticate([Role.User]), create)
router.put('/:id',Authenticate([Role.User]), update)
router.get('/all/user',Authenticate([Role.User]), getByUserId)
router.get('/:id',Authenticate([Role.User]), getById)
router.delete('/:categoryId',Authenticate([Role.User]), remove)

export default router