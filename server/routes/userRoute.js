import express from "express";
import { getAllUsers } from "../controller/userController.js";
import { register } from "../controller/userController.js";
import { imageUpload } from "../controller/userController.js";
import multerUpload from "../middlewares/multer.js";


const route = express.Router()
route.get('/users', getAllUsers)
route.post('/register', register)
route.post('/profilePhoto',multerUpload.single("profilePhoto"), imageUpload)

export default route