import { v2 as cloudinary } from 'cloudinary';
// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key:process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_KEY 
});

export const deleteFiles = async(files:string[]) =>{
    files.map(async(public_id) => {
            await cloudinary.uploader.destroy(public_id)
    })

}


export default cloudinary