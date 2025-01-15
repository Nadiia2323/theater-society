
import express from "express";
import cors from "cors"
import router from "./routes/testRoute.js";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import theaterUsersRouter from "../server/routes/theaterUsersRoute.js"
import userRouter from "../server/routes/userRoute.js"
import cloudinaryConfig from "./config/cloudinary.js";
import passport  from "passport";
import passportConfig from "./config/passport.js";

dotenv.config();

const DBConnection = async() => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MONGO_URI:', process.env.MONGO_URI);
    console.log('connection to mongoose :>> ');

  } catch (error) {
    console.log('error');
    
  }
}
// console.log('MONGO_URI:', process.env.MONGO_URI);
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("Connection to Mongo DB established"))
//   .catch((err) => console.log(err));


const app = express();

const addMiddlewares = () => {
  app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors())
cloudinaryConfig()
passportConfig(passport)
}



const addRoutes = () => {
  app.use("/myApi", router)
app.use("/myApi/theaters", theaterUsersRouter)
app.use('/myApi/users', userRouter)
}



const startServer = () => {
  const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server is running on " + port + " port");
});
}



//IIFE
(async function controller() {
  await DBConnection(),
    addMiddlewares();
  addRoutes();
  startServer();
})()
