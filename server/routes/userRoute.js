import express from "express";
import { deleteAccount, deletePost, getAllUsers, getUserProfile, login, updateProfile, uploadPosts } from "../controller/userController.js";
import { register } from "../controller/userController.js";
import { imageUpload } from "../controller/userController.js";
import multerUpload from "../middlewares/multer.js";
import jwtAuth from "../middlewares/jwtAuth.js";



const route = express.Router()
route.get('/users', getAllUsers)
route.post('/register', register)
route.post('/profilePhoto',jwtAuth, multerUpload.single("profilePhoto"), imageUpload)
route.post('/login', login)
route.get('/profile', jwtAuth, getUserProfile)
route.put('/profileSettings',jwtAuth, updateProfile)
route.post('/posts', jwtAuth, multerUpload.single("posts"), uploadPosts)
route.delete('/deleteAccount', jwtAuth, deleteAccount)
route.delete('/deletePost',jwtAuth,deletePost)

export default route