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
  backgroundPhoto: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  director: {
    type: String,
  },
  quote: {
    type: String,
  },
  about: {
    type: String,
  },
  gallery: {
    type: [String],
  },
  actors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
   posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
    favorites: [
       {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }
  ],
}, { timestamps: true });

const TheaterUserModel = mongoose.model("TheaterUser", theaterUserSchema);
export default TheaterUserModel;
