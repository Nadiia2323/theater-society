import express from "express"
import User from "../model/UserModel.js";

const router = express.Router()

// router.get("/test", (req,res) => {
//     res.send({
//        msg:"test,"
//    })
// })

// export default router

// const users = [
//     {name:"user1"},
//     {name:"user2"},
// ]

router.get("/test", (req, res) => {
    console.log("route running")
  res.send({ msg: "Test route." });
});
// router.get("/users", async (req, res) => {
//   console.log("Users route running");
//   try {
//     const users = await User.find({}); 
//     if (users && users.length > 0) {
//       return res.send(users);
//     } else {
//       return res.send({ error: "No users found" });
//     }
//   } catch (err) {
//     return res.status(500).send({ error: err.message });
//   }
// });
//go to the database and find the list of users, and store into a variable called users

//   res.send({ usersList:users });
// });
export default router;