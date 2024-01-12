import express from "express"
import { addActors, backgroundPhoto, getAllTheatherUsers,getCast,registerTheater, updateTheaterProfile, uploadImage, uploadTheaterPosts } from "../controller/theaterUserController.js"
import route from "./userRoute.js"
import jwtAuth from "../middlewares/jwtAuth.js";
import { getTheaterProfile } from "../controller/theaterUserController.js";
import multerUpload from "../middlewares/multer.js";

const router = express.Router()

router.get('/all', getAllTheatherUsers)
route.get('/profile', jwtAuth, getTheaterProfile)
router.post('/register', registerTheater)
router.put('/settings',jwtAuth,updateTheaterProfile)
router.post('/background', jwtAuth, multerUpload.single("backgroundPhoto"), backgroundPhoto)
router.post('/photo', jwtAuth, multerUpload.single('photo'), uploadImage)
router.post('/posts', jwtAuth, multerUpload.single('posts'), uploadTheaterPosts)
router.post('/actors', jwtAuth, addActors)
router.get('/cast',jwtAuth,getCast)

// route.post('/posts', jwtAuth, multerUpload.single("posts"), uploadTheaterPosts)




export default router

