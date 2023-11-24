
import express from "express";
import cors from "cors"
import router from "./routes/testRoute.js";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import theaterRouter from "../server/routes/theaterRoute.js"
import userRouter from "../server/routes/userRoute.js"

dotenv.config();

// const DBConnection = async() => {
//   try {
//     await mongoose.connection(process.env.MONGO_URI)
//     console.log('connection to mongoose :>> ');
//   } catch (error) {
//     console.log('error');
    
//   }
// }
console.log('MONGO_URI:', process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connection to Mongo DB established"))
  .catch((err) => console.log(err));


const app = express();
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors())

app.use("/myApi", router)
app.use("/myApi", theaterRouter)
app.use('/myApi', userRouter)

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server is running on " + port + " port");
});


