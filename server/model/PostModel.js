
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  caption: { type: String },
  imageUrl: { type: String },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TheaterUserModel',
      required: false
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TheaterUserModel',
      required: false
    },
    userName:{type:String},
    text: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TheaterUserModel',
    required: false
  }
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
export default Post;
