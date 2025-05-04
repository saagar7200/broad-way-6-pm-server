import { NextFunction, Request, Response } from "express"


class CustomError extends Error {

        statusCode:number
        status:'error' | 'fail'
        success:boolean
        isOperation:boolean

    constructor(message:string,statusCode:number){
        super(message)
        this.statusCode = statusCode
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error'
        this.success=false
        this.isOperation = true

        Error.captureStackTrace(this,CustomError)
    }

}



export const errorHandler =  (err:any,req:Request,res:Response,next:NextFunction) =>{  
    const success = err.success || false;
    const statusCode = err.statusCode || 500
    const status = err.status || 'error'
    const message = err?.message ?? 'Something went wrong'

console.log("👊 ~ error-handler.middleware.ts:31 ~ errorHandler ~ err:", err)


    res.status(statusCode).json({
        success,
        status,
        message
    })
}

export default CustomError