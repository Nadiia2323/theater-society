import { Timestamp } from 'mongodb';
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
      caption: { type: String },
      imageUrl: { type: String },
      // likes: [ {type: mongoose.Types.ObjectId}]
}, { timestamps: true })

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required:false,
    
  },
 
    email: {
      type: String,
      required: true,
      unique: true,
  },
  password: {
    type: String,
    require: true,

  },
  profilePhoto: {
    type: String,
    required: false
  },
  posts: [postSchema]
  
  
});
const User = mongoose.model("user", userSchema);
export default User;