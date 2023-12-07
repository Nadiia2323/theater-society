import express from "express"
import { getAllTheatherUsers,registerTheater } from "../controller/theaterUserController.js"
import route from "./userRoute.js"
import jwtAuth from "../middlewares/jwtAuth.js";
import { getTheaterProfile } from "../controller/theaterUserController.js";

const router = express.Router()

router.get('/all', getAllTheatherUsers)
route.get('/profile', jwtAuth, getTheaterProfile)


router.post('/register', registerTheater)

export default router
// router.get("/test", (req, res) => {
//     console.log("route running")
//   res.send({ msg: "Test route." });
// });
// router.get("/users", async (req, res)  => {
//     console.log("route running")
//     try {
//     const users = await users.find({});
//     if (users) {
//       return res.send(users)
//     } else {
//       return res.send({ error: "No users found" })
//     }
//   } catch (err) {
//     return res.send({ error: err.message })
//   }
// });