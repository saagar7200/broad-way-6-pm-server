import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import { connectDatabase } from './config/database.config'
import helmet from 'helmet'
import cors from 'cors'
import CustomError, { errorHandler } from './middlewares/error-handler.middleware'

// importing routes
import userRoutes from './routes/user.routes'
import categoryRoutes from './routes/category.routes'
import expenseRoutes from './routes/expense.routes'



const app = express()

const PORT  = process.env.PORT
const DB_URI = process.env.DB_URI ?? ''

connectDatabase(DB_URI)

// using middlewares
app.use(helmet());
app.use(cors({
    origin:'*'
}))
// console.log(__dirname)

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/api/uploads',express.static('uploads/'))


app.get('/', (req:Request,res:Response) =>{
    res.status(200).json({
        message:'Server is up & running'
    })
})

// using routes
app.use('/api/user',userRoutes)
app.use('/api/category',categoryRoutes)
app.use('/api/expense',expenseRoutes)


app.all('/*spalt',(req:Request,res:Response,next:NextFunction)=>{
const message = `Can not ${req.method} on ${req.url}`
const error = new CustomError(message,404)
next(error)
})


// listening on port
app.listen(PORT,()=>{
    console.log(`server is running at ${PORT}`)
})


app.use(errorHandler)
