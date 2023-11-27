import mongoose from 'mongoose';

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
  photo: {
    type: String,
    required: false
  }
  
  
});
const User = mongoose.model("User", userSchema);
export default User;