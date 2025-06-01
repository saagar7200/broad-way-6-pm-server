
import express from 'express'
import {create,getAll,getById,getByUserId,update } from '../controllers/expense.controller';
import { Authenticate } from '../middlewares/authentication.middleware';
import { Role } from '../types/enums';
import multer from 'multer'
import {uploader} from '../middlewares/upload.middleware'
const router = express.Router();

const upload = uploader()


router.post('/',Authenticate([Role.User]),upload.array('receipts',3),create)
router.put('/:id',Authenticate([Role.User]),upload.array('receipts',3),update)
router.get('/user/',Authenticate([Role.User]),getByUserId)
router.get('/:id',Authenticate([Role.User,Role.Admin]),getById)
router.get('/',Authenticate([Role.Admin]),getAll)
// router.delete('/:id',Authenticate([Role.User]),remove)


export default router