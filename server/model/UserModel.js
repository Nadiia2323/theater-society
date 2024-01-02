import { Timestamp } from 'mongodb';
import mongoose from 'mongoose';

// const postSchema = new mongoose.Schema({
//       caption: { type: String },
//       imageUrl: { type: String },
//   likes: [{
//     type: mongoose.Types.ObjectId,
//     ref: 'User'
//   }],
//  comments: [{
//     user: {
//       type: mongoose.Types.ObjectId,
//       ref: 'User'
//     },
//     text: { type: String },
//     createdAt: { type: Date, default: Date.now }
//   }]
// }, { timestamps: true })

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
  quote: {
    type: String,
  },
  about: {
    type:String
  },
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
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
}
  
  
);
const User = mongoose.model("user", userSchema);
export default User;