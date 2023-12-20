import express from "express";
import { commentPost, deleteAccount, deleteComment, deletePost, favoritePosts, getAllPosts, getAllUsers, getLikes, getUser, getUserProfile, likePost, login, updateProfile, uploadPosts } from "../controller/userController.js";
import { register } from "../controller/userController.js";
import { imageUpload } from "../controller/userController.js";
import multerUpload from "../middlewares/multer.js";
import jwtAuth from "../middlewares/jwtAuth.js";



const route = express.Router()
route.get('/all', getAllUsers)
route.get('/profile', jwtAuth, getUserProfile)
route.get('/allPosts',getAllPosts)
route.get("/:userId",getUser)
route.post('/register', register)
route.post('/profilePhoto',jwtAuth, multerUpload.single("profilePhoto"), imageUpload)
route.post('/login', login)

route.put('/profileSettings',jwtAuth, updateProfile)
route.post('/posts', jwtAuth, multerUpload.single("posts"), uploadPosts)
route.delete('/deleteAccount', jwtAuth, deleteAccount)
route.delete('/deletePost', jwtAuth, deletePost)
route.post('/likes', jwtAuth, likePost)
route.get('allLikes',jwtAuth,getLikes)
route.post('/comments', jwtAuth, commentPost)
route.delete('/deleteComment', jwtAuth, deleteComment)
route.post('/favorites',jwtAuth,favoritePosts)//not working yet
export default route