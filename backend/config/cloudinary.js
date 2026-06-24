//purpose:: connects backend to cloudinary; allow images uploads

import {v2 as cloudinary} from 'cloudinary'     //importing version 2 of cloudinary and renaming it as cloudinary

const connectCloudinary = async () => {         //creates a function.. async means this function will take time as it connects to the internet
    cloudinary.config({                          //these are the credentials to login to cloudinary
        cloud_name: process.env.CLOUDINARY_NAME,       //process.env helps access environment variables
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY
        
    })

}
export default connectCloudinary     //exports function so other files cna use it