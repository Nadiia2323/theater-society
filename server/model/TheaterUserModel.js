import mongoose from "mongoose";

const theaterUserSchema = new mongoose.Schema({
    theaterName: {
    type: String,
    required: true,
    
  },
  profilePhoto: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    require: true,
    unique: true,
  },
        country: {
    type: String,
    required: false,
    
    },
            city: {
    type: String,
    required: false,
    
    },
         followers: {
    type: Number,
    required: false,
    
  },    following: {
    type: Number,
    required: false,
    
  },
})

const TheaterUserModel = mongoose.model("theateruser", theaterUserSchema);
export default TheaterUserModel


