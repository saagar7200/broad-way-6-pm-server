
import {Schema,model,Types} from 'mongoose'

const today = new Date().toISOString().split('T')[0]
const expenseSchema = new Schema({
    title:{
        type:String,
        required:[true,'Expense title is required'],
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    amount:{
        type:Number,
        required:[true,'Expense amount is required'],    
    },
    date:{
        type:Date,
        default:today
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        required:[true,'User is required'],
        ref:'user'
    },
    category:{

        type:Schema.Types.ObjectId,
        required:[true,'Category is required'],
        ref:'category'
    },
    receipts:[
        {
            path:{
                type:String,
                required:true
            },
            public_id:{
                type:String ,
                required:true

            }
        }
    ]

},{timestamps:true})


const Expense = model('expense',expenseSchema)
export default Expense