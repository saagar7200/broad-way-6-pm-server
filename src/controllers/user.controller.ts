import { NextFunction, Request, Response } from "express"
import User from "../models/user.model"
import asyncHandler from "../utils/async-handler.util"
import CustomError from "../middlewares/error-handler.middleware"
import { compare, hash } from "../utils/bcrypt.util"
import { generateJwtToken } from "../utils/jwt.util"
import { Role } from "../types/enums"
import { getPagination } from "../utils/pagination.util"

export const register = asyncHandler(async(req:Request,res:Response,next:NextFunction) =>{
        const {password,role,...data} = req.body
        if(!password){
            throw new CustomError('Password is required',400)
        }

        const hashedPassword = await hash(password)


        const user = await User.create({...data,password:hashedPassword})

        res.status(201).json({
            success:true,
            status:'success',
            data:user
        })
   
})


export const login = asyncHandler(async(req:Request,res:Response,next:NextFunction) =>{
    const {password,email} = req.body
    if(!email){
        throw new CustomError('Email is required',400)
    }
    if(!password){
        throw new CustomError('Password is required',400)
    }

    // find user by email => user
    const user = await User.findOne({email})

    //if !user -> Invalid email or password

    if(!user){
        throw new CustomError('Invalid email or password',400)
    }
    // compare user password and  user.password

    const isPasswordMatched = await compare(user.password,password)

    // if -> false => Invalid email or password
    if(!isPasswordMatched){

        throw new CustomError('Invalid email or password',400)
    }
    const payload = {
        _id:user._id,
        email:user.email,
        fullName:user.fullName,
        userName:user.userName,
        role:user.role
    }

    const token = generateJwtToken(payload)
   
    res.status(201).json({
        success:true,
        status:'success',
        data:user,
        message:'logged in success',
        access_token:token
    })

})


export const adminLogin = asyncHandler(async(req:Request,res:Response,next:NextFunction) =>{
    const {password,email} = req.body
    if(!email){
        throw new CustomError('Email is required',400)
    }
    if(!password){
        throw new CustomError('Password is required',400)
    }

    // find user by email => user
    const user = await User.findOne({email})

    //if !user -> Invalid email or password

    if(!user || user.role !== Role.Admin){
        throw new CustomError('Invalid email or password',400)
    }
    // compare user password and  user.password

    const isPasswordMatched = await compare(user.password,password)

    // if -> false => Invalid email or password
    if(!isPasswordMatched){

        throw new CustomError('Invalid email or password',400)
    }
    const payload = {
        _id:user._id,
        email:user.email,
        fullName:user.fullName,
        userName:user.userName,
        role:user.role
    }

    const token = generateJwtToken(payload)
   
    res.status(201).json({
        success:true,
        status:'success',
        data:user,
        message:'logged in success',
        access_token:token
    })

})


export const getProfile  = asyncHandler(async(req:Request,res:Response)=>{

    const id = req.user._id

    const profile = await User.findById(id).select('-password')

    if(!profile){
        throw new CustomError('Profile not found',404)
    }

    res.status(200).json({
        success:true,
        message:'Profile fetched',
        data:profile,
        status:'success'
    })

})


export const getUserById  = asyncHandler(async(req:Request,res:Response)=>{

    const {id} = req.params

    const user = await User.findById(id).select('-password')
    if(!user){
        throw new CustomError('User not found',404)
    }

    res.status(200).json({
        success:true,
        message:'User fetched',
        data:user,
        status:'success'
    })

})

export const getAllUser = asyncHandler(async(req:Request,res:Response)=>{

    const limit:number = parseInt(req.params.perPage) ?? 10
    const page = parseInt(req.params.page) ?? 1
    const skip = (page - 1) * limit


    const users = await User.find({}).select('-password').limit(limit).skip(skip)
    const total = await User.countDocuments()

  

    const pagination = getPagination(total,page,limit)

    
    res.status(200).json({
        success:true,
        message:'User fetched',
        data:{
            data:users,
            pagination
        },
        status:'success'
    })

})


export const remove = asyncHandler(async(req:Request,res:Response)=>{

 const {id} = req.params
 await User.findByIdAndDelete(id)
    
    res.status(200).json({
        success:true,
        message:'User deleted',
        data:null,
        status:'success'
    })

})
