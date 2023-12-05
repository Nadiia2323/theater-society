import express from "express";
import { getAllUsers, getUserProfile, login, updateProfile } from "../controller/userController.js";
import { register } from "../controller/userController.js";
import { imageUpload } from "../controller/userController.js";
import multerUpload from "../middlewares/multer.js";
import jwtAuth from "../middlewares/jwtAuth.js";



const route = express.Router()
route.get('/users', getAllUsers)
route.post('/register', register)
route.post('/profilePhoto', multerUpload.single("profilePhoto"), imageUpload)
route.post('/login', login)
route.get('/profile', jwtAuth, getUserProfile)
route.put('/profileSettings',updateProfile)

export default route