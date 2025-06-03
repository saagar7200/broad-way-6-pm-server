import { Request,Response } from "express";
import asyncHandler from "../utils/async-handler.util";
import Expense from "../models/expense.model";
import Category from "../models/category.model";
import CustomError from '../middlewares/error-handler.middleware'
import mongoose from "mongoose";
import { deleteFiles } from "../config/cloudinary.config";
import { sendMail } from "../utils/send-mail";


export const create = asyncHandler(async(req:Request,res:Response) =>{
    const user:mongoose.Types.ObjectId = req.user._id
    const {categoryId,...data} = req.body

    const receipts = req.files as Express.Multer.File[]

    const expense = new Expense(data)
    expense.createdBy = user 

    
    const category = await Category.findById(categoryId)
    if(!category){
        throw new CustomError('Category not found',404)
    }

    expense.category = category._id

    if(receipts && receipts.length > 0){

        receipts.forEach(receipt =>  {
            expense.receipts.push({
                public_id:receipt.filename,
                path:receipt.path
            }) 
        }  )
       
    }


    await expense.save()


    const html = `
    <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #ccc; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
      <h2 style="color: #2e7d32; border-bottom: 2px solid #4caf50; padding-bottom: 8px;">Expense Added Successfully</h2>
      <p style="font-size: 16px;">Hello <strong>${req.user.fullName ?? 'User'}</strong>,</p>
      <p style="font-size: 15px;">Your expense has been recorded. Here are the details:</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr>
          <th style="text-align: left; background-color: #e0e0e0; padding: 8px; border: 1px solid #ccc;">Title</th>
          <td style="padding: 8px; border: 1px solid #ccc;">${expense.title}</td>
        </tr>
        <tr>
          <th style="text-align: left; background-color: #e0e0e0; padding: 8px; border: 1px solid #ccc;">Amount</th>
          <td style="padding: 8px; border: 1px solid #ccc;">Rs. ${expense.amount}</td>
        </tr>
        <tr>
          <th style="text-align: left; background-color: #e0e0e0; padding: 8px; border: 1px solid #ccc;">Category</th>
          <td style="padding: 8px; border: 1px solid #ccc;">${category.name}</td>
        </tr>
        <tr>
          <th style="text-align: left; background-color: #e0e0e0; padding: 8px; border: 1px solid #ccc;">Created At</th>
          <td style="padding: 8px; border: 1px solid #ccc;">
            ${new Date(expense.createdAt).toLocaleDateString('en-us',{
              day: 'numeric',
              weekday: 'short',
              month: 'long',
              year: 'numeric'
            })}
          </td>
        </tr>
      </table>
      <p style="font-size: 14px; color: #777; margin-top: 20px;">Thank you for using our expense tracker! to update it <a target='__blank' href='http://localhost:8000'>click here</a></p>
    </div>
  `;
  

    const text = `New Expense is recorded: ${expense.title}, by ${req.user.fullName} at 
        ${new Date(expense.createdAt).toLocaleDateString('en-us',{
            day:'numeric',
            weekday:'short',
            month:'long',
            year:'numeric'
        })}`

    await sendMail({
        to:req.user.email,
        subject:'New Expense Recorded.',
        html:html
    })

    res.status(201).json({
        data:expense,
        success:true,
        status:'success',
        message:'Expense created'
    })
})

export const update = asyncHandler(async(req:Request,res:Response) =>{
    // const session = await mongoose.startSession()
    // session.startTransaction()
    try{


        const user:mongoose.Types.ObjectId = req.user._id
        const {categoryId,deletedReceipts,title,date,amount,description} = req.body
        const  {id} = req.params
        const receipts = req.files as Express.Multer.File[]

        const expense = await  Expense.findOne({_id:id,createdBy:user})
    
        if(!expense){
            throw new CustomError('Expense not found',404)
    
        }

        if(title) expense.title = title
        if(date) expense.date = date
        if(amount) expense.amount = amount
        if(description) expense.description = description
    
    
      
        if(categoryId){
            const category = await Category.findById(categoryId)
            if(!category){
            throw new CustomError('Category not found',404)
            }
    
            expense.category = category._id
        }
    
        if(receipts && receipts.length > 0){
            receipts.forEach(receipt =>  {
                expense.receipts.push({
                    public_id:receipt.filename,
                    path:receipt.path
                }) 
            }  )
           
        }
    
        if(deletedReceipts){

            const fileToDelete:string[] = JSON.parse(deletedReceipts)           
    
            if(Array.isArray(fileToDelete) && fileToDelete.length > 0){

                const filteredReceipts = expense.receipts.filter(
                    (receipt: any) => !fileToDelete.includes(receipt.public_id)
                )
                expense.set('receipts', filteredReceipts);


              await deleteFiles(fileToDelete)
            }
        }
    
    
        await expense.save()
        // await session.commitTransaction()
        // session.endSession()
    
        res.status(201).json({
            data:expense,
            success:true,
            status:'success',
            message:'Expense updated'
        })
    
    }catch(error:any){
        // await session.abortTransaction()
        // session.endSession()
        throw new CustomError(error?.message ?? 'Fail to update expense',500)

    }
    
})


export const remove  = asyncHandler(async(req:Request,res:Response)=>{
    const {id} = req.params
    const userId = req.user._id

    const expense = await Expense.findById(id)

    if(!expense){
        throw new CustomError('Expense not found',404)
    }

    if(expense.createdBy !== userId){
        throw new CustomError('Only owner can perform this operation',400)
    }

    if(expense.receipts ){
        await deleteFiles(expense.receipts.map(receipt => receipt.public_id))
    }

    await expense.deleteOne()

    res.status(200).json({
        success:true,
        status:'success',
        message:'expense deleted'
    })


})

export const getByUserId = asyncHandler(async(req:Request,res:Response)=>{

    const userId = req.user._id

    const expenses = await Expense.find({createdBy:userId}).populate('category')

    res.status(201).json({
        message:'expense by user Id',
        data:expenses,
        success:true,
        status:'success'
    })

})

export const getById = asyncHandler(async(req:Request,res:Response)=>{

    const userId = req.user._id
    const {id} = req.params

    const expense = await Expense.findOne({_id:id ,createdBy:userId}).populate('createdBy')
    if(!expense){
        throw new CustomError('expense not found',404)
    }

    res.status(201).json({
        message:'expense by user Id',
        data:expense,
        success:true,
        status:'success'
    })

})

export const getAll = asyncHandler(async(req:Request,res:Response)=>{

    const expenses = await Expense.find({})
    

    res.status(201).json({
        message:'All expenses fetched',
        data:expenses,
        success:true,
        status:'success'
    })

})