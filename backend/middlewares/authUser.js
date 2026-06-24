import jwt from "jsonwebtoken"

//user authentication middleware
export const authUser = async(req,res,next) =>{  //if no issue next() will be called
    //middleware functions need a callback func that is next
    
    try {
       
        const {token} = req.headers   //header contains extra info like content-type, authorization, cookies
        // curly braces extracts the property directly from the header as it is already present
        if(!token){
            return res.json({success:false, message:"Not authorised login again"})
        }
        const token_decode = jwt.verify(token,process.env.JWT_SECRET) //this will give us whatever was used during sign in that is email pswd
    


req.userId = token_decode.id  //to get the user id from token and add it to req.body

        next()
        
    } catch (error) {
           console.log(error)
        return res.json({success:false, message:error.message})
    }

}