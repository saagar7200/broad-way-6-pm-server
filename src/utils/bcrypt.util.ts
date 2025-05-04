import bcrypt from "bcryptjs";

export const hash = async(value:string):Promise<string> =>{
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(value,salt)

}

export const compare = async(hashed:string,plainText:string):Promise<boolean> =>{
    return await bcrypt.compare(plainText,hashed)
}