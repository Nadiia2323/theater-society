import mongoose from "mongoose";

const theaterSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
    
    },
        country: {
    type: String,
    required: true,
    
    },
            city: {
    type: String,
    required: true,
    
    },
                status: {
    type: String,
    required: true,
    
    },
                    description: {
    type: String,
    required: true,
    
  },    followers: {
    type: Number,
    required: true,
    
  },    likes: {
    type: Number,
    required: true,
    
  },
})

const TheaterModel = mongoose.model("theater", theaterSchema);
export default TheaterModel


