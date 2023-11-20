import express from "express"
import { getAllTheathers } from "../controller/theaterController.js";

const router = express.Router()

router.get('/theaters',getAllTheathers)

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