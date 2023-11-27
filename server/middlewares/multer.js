import { Error } from "mongoose";
import multer from "multer"
import path from "path"

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb ) => {

    let extension = path.extname(file.originalname);

    if (extension !== ".jpg" && extension !== ".png" && extension !== ".jpeg") {
         cb(null, false)
    } else {
        console.log("upload accepted");
        cb(null, true)
    }
   
    
    
    
    // cb(new Error("something went wrong"))
};

const multerUpload = multer({ fileFilter, storage: storage });
export default multerUpload