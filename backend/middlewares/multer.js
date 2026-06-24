//purpose :: allows backend to accept images from the frontend

import multer from "multer"
const storage = multer.diskStorage({   //creates a storage engine.. saves the file temporarily on disk
    filename: function(req,file,callback){      //this controls the name of the file.. multer needs filename and location
        //callback = done procession filename
        callback(null,file.originalname)
        //callback(error,data) - no error occured -> file name = original name
    }
})
const upload = multer({storage}) // creates actual multer middleware.. use multer with this storage config
export default upload  //export so that it cna be used in routes