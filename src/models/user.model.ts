
import {Schema,model} from 'mongoose'
import { Role } from '../types/enums'

const userSchema = new Schema({
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:[true,'User already exists with provided email'],
        match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/,'Please enter a valid email address',]
    },
    role:{
        type:String,
        enum:Object.values(Role),
        default:Role.User,
        required:true
    },
    fullName:{
        type:String,
        required:[true,'Name is required'],    
    },
    password:{
        type:String,
        required:[true,'Password is required'],    
    },
    userName:{
        type:String,
        required:[true,'Username is required'],    

    }
},{timestamps:true})

const User = model('user',userSchema)

export default User