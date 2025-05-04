import jwt from 'jsonwebtoken'
import { IPayload } from '../types/global.types';

const JWT_SECRET = process.env.JWT_SECRET ?? ''
const JWT_EXPIRE_IN = process.env.JWT_EXPIRE_IN

export const generateJwtToken = (payload:IPayload) =>{
    return jwt.sign(payload,JWT_SECRET,{expiresIn:JWT_EXPIRE_IN as any})
}

export const verifyJwtToken = (token:string):jwt.JwtPayload =>{
    return jwt.verify(token,JWT_SECRET) as jwt.JwtPayload
}

