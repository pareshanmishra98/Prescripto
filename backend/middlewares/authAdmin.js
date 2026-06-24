import jwt from "jsonwebtoken"

//admin authentication middleware
export const authAdmin = async(req,res,next) =>{  //if no issue next() will be called
    //middleware functions need a callback func that is next
    try {

        console.log(req.headers)
        const {atoken} = req.headers   //header contains extra info like content-type, authorization, cookies
        // curly braces extracts the property directly from the header as it is already present
        if(!atoken){
            return res.json({success:false, message:"Not authorised login again"})
        }
        const token_decode = jwt.verify(atoken,process.env.JWT_SECRET) //this will give us whatever was used during sign in that is email pswd
        if(token_decode.email !== process.env.ADMIN_EMAIL && token_decode.password !== process.env.ADMIN_PASSWORD){
            return res.json({success:false, message:"Not authorised login again"})
        }
        next()
        
    } catch (error) {
           console.log(error)
        return res.json({success:false, message:error.message})
    }

}