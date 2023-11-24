import express from "express";
import { getAllUsers } from "../controller/userController.js";
import { register } from "../controller/userController.js";


const route = express.Router()
route.get('/users', getAllUsers)
route.post('/register', register)

export default route