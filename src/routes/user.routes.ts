
import express from 'express'
import { getAllUser, login, register, remove,getProfile,adminLogin } from '../controllers/user.controller';
import { Authenticate } from '../middlewares/authentication.middleware';
import { Role } from '../types/enums';

const router = express.Router();

router.post('/register',register)
router.post('/login',login)
router.post('/admin/login',adminLogin)

router.get('/',Authenticate([Role.Admin]),getAllUser)
router.delete('/:id',Authenticate([Role.Admin]),remove)
router.get('/profile',Authenticate([Role.User]),getProfile)


export default router