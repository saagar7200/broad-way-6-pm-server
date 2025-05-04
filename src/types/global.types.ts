import mongoose from "mongoose";
import { Role } from "./enums";

export type  IPayload  ={
    _id:mongoose.Types.ObjectId;
    email:string,
    userName:string,
    fullName:string,
    role:Role
}