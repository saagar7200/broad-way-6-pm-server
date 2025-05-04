import { NextFunction, Request,Response } from "express";
import { Role } from "../types/enums";
import CustomError from "./error-handler.middleware";
import { verifyJwtToken } from "../utils/jwt.util";
import User from "../models/user.model";


export const Authenticate =(roles?:Role[]) =>{

    return async (req:Request,res:Response,next:NextFunction) =>{
       try{
         // get authorization header
         const auth_header = req.headers['authorization']

         if(!auth_header ){
             throw new CustomError('Authorization header is missing',401)
         }
 
         if(!auth_header.startsWith('BEARER')){
             throw new CustomError('Unauthorized, access denied',401)
 
         }

        //  get token 
 
         const token  = auth_header.split(' ')[1]
 
         if(!token){
             throw new CustomError('Unauthorized, access denied',401)
         }
 
        //  verify token
         const decoded =  verifyJwtToken(token)

         if(!decoded){
            throw new CustomError('Access token is expired or malformed, access denied',400)

         }


        //  expiry of token

        if(decoded?.exp && decoded.exp * 1000 < Date.now() ){
            throw new CustomError('Access token is expired, access denied',400)

        }

 
        //  search for user
         const user = await User.findById(decoded._id)
 
         if(!user){
             throw new CustomError('Unauthorized, access denied',401)
         }
 
        //  check for authorized role
         if(roles && !roles.includes(user.role)){
             throw new CustomError('Forbidden, access denied',403)
 
         }

         req.user = {
            _id:decoded._id,
            email:decoded.email,
            fullName:decoded.fullName,
            role:decoded.role,
            userName:decoded.userName
         }
 
         next()
 
       }catch(error){
        next(error)
       }


    }

}
