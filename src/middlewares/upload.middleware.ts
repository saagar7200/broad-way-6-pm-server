
import multer from 'multer'
import fs from 'fs'
import cloudinary from '../config/cloudinary.config'
import {CloudinaryStorage} from 'multer-storage-cloudinary'


export const uploader = () =>{
    
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req,res) =>{
      return {
        folder: 'expenses/receipts',
        allowed_formats:['png','jpg','webp','pdf']
      }
    },
  });
    
    return multer({storage})
}