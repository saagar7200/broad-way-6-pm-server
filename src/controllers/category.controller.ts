import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler.util";
import CustomError from "../middlewares/error-handler.middleware";
import User from "../models/user.model";
import Category from "../models/category.model";

export const create = asyncHandler(async(req:Request,res:Response)=>{

    const {name} = req.body
    const userId = req.user._id

   

    const user = await User.findById(userId)

    if(!user){
        throw new CustomError('User not found',404)
    }

    const category = await Category.create({name,user:user._id})

    if(!category){
        throw new CustomError('Category not created.',401)
    }

    res.status(201).json({
        message:'Category created',
        data:category,
        success:true,
        status:'success'
    })

})



export const update = asyncHandler(async(req:Request,res:Response)=>{

    const {name} = req.body
    const {id} = req.params
    const userId = req.user._id

    if(!name){
        throw new CustomError('Category name  is required',400)
    }
    

    const user = await User.findById(userId)

    if(!user){
        throw new CustomError('User not found',404)
    }
    
    const category = await Category.findById(id)


    if(!category){
        throw new CustomError('Category not found.',404)
    }
    

    if(category.user !== user._id){
        throw new CustomError('Only category owner can perform this operation.',403)
    }

        category.name = name
        const updatedCategory =  await category.save()




    res.status(201).json({
        message:'Category updated',
        data:updatedCategory,
        success:true,
        status:'success'
    })

})


export const getByUserId = asyncHandler(async(req:Request,res:Response)=>{

    const userId = req.user._id

    const categories = await Category.find({user:userId})

    res.status(201).json({
        message:'Category by user Id',
        data:categories,
        success:true,
        status:'success'
    })

})

export const getById = asyncHandler(async(req:Request,res:Response)=>{

    const userId = req.user._id
    const {id} = req.params

    const category = await Category.findOne({_id:id ,user:userId})
    if(!category){
        throw new CustomError('Category not found',404)
    }

    res.status(201).json({
        message:'Category by user Id',
        data:category,
        success:true,
        status:'success'
    })

})

export const getAll = asyncHandler(async(req:Request,res:Response)=>{

    const categories = await Category.find({})
    

    res.status(201).json({
        message:'All categories fetched',
        data:categories,
        success:true,
        status:'success'
    })

})


export const remove = asyncHandler(async(req:Request,res:Response)=>{

    const user = req.user._id
    const {categoryId} = req.params

    const category = await Category.findById(categoryId)
    if(!category){
        throw new CustomError('Category not found',404)
    }

    if(category.user.toString() !== user.toString()){
        throw new CustomError('You can not perform this action',403)
    }

    await category.deleteOne()


    res.status(201).json({
        message:'Category deleted',
        data:null,
        success:true,
        status:'success'
    })

})