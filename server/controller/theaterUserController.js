
import TheaterUserModel from "../model/TheaterUserModel.js";
import User from "../model/UserModel.js";
import { encryptPassword } from "../unils/encryptPassword.js";
import { v2 as cloudinary } from "cloudinary";

const getAllTheatherUsers = async (req, res) => {
    console.log('route running');
    try {
        const theaterUsers = await TheaterUserModel.find({});
        if (theaterUsers.length > 0) {
            return res.json({
                number: theaterUsers.length,
                theaterUsers: theaterUsers
            });
        } else {
            return res.json({
                message: 'No theater users found.'
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            errorMessage: 'Something went wrong.'
        });
    }
};
const registerTheater = async  (req, res) => {
    console.log('register theater controller working ');
    console.log(req.body)
    try {
   const existingUser = await User.findOne({ email: req.body.email });
    const existingTheaterUser = await TheaterUserModel.findOne({ email: req.body.email });

    if (existingUser || existingTheaterUser) {
      res.status(203).json({
        message: "Email already exists",
      });
    } else {
        const hashedPassword = await encryptPassword(req.body.password)
    if (hashedPassword) {
        const newTheaterUser = new TheaterUserModel({
            theaterName: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });
        
        const savedTheaterUser = await newTheaterUser.save();
        console.log('savedUser :>> ', savedTheaterUser);

        res.status(201).json({
            message: "user registered",
            savedTheaterUser,
        });
        
        
    } else {
        res.status(500).json({
            message: Error
        })
    }
    
        
    }
    } catch (error) {
        console.log('error :>> ', error);
        
    }
   
   
   
   
}
 const getTheaterProfile = async (req, res) => {
  console.log("gettheaterProfile is running");
  console.log('req.user :>> ', req.user);
  if (req.user) {
    res.status(200).json({
      message: "theater profile",
      user: {
        id: req.user._id,
        email: req.user.email,
        userName: req.user.name,
         profilePhoto: req.user.profilePhoto
      }
    })
    
  }
  if (!req.user) {
    res.status(400).json({
      message:"something went wrong, login one more time"
    })
    
     
     }
     }
const uploadTheaterPosts = async(req, res) => {
         const { email, caption } = req.body  //imagine user has sent a caption
  
   if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "posts",
      });
      console.log("result uploading :>> ", result);
      // const user = await User.findOne(email); 
      const user = req.user
      if (user) {
        const newPost = { imageUrl: result.secure_url, caption: req.body.caption }
        const posts = [...user.posts, newPost]
        // await user.save()
      user.posts = posts;
      await user.save();
    }

      res.status(201).json({
        message: "post uploaded",
        posts: result.secure_url,

      });
    } catch (error) {
      console.log("error :>> ", error);
      res.status(500).json({ error: "Failed to upload post" });
    }
  } else {
    res.status(500).json({
      message: "file not supported",
    });
  }


}
     
const backgroundPhoto = async (req,res) => {
  console.log("background working");
  console.log('req.file :>> ', req.file);
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "background_image",
      });
      console.log("result uploading :>> ", result);
      
      const theaterUser=req.user
    if (theaterUser) {
      theaterUser.backgroundPhoto = result.secure_url;
      await theaterUser.save();
    }

      res.status(201).json({
        message: "image uploaded",
        backgroundPhoto: result.secure_url,

      });
    } catch (error) {
      console.log("error :>> ", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  } else {
    res.status(500).json({
      message: "file not supported",
    });
  }
}
  
const uploadImage = async (req, res) => {
   if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "Photo",
      });
      console.log("result uploading :>> ", result);
      
      const theaterUser=req.user
    if (theaterUser) {
      theaterUser.profilePhoto = result.secure_url;
      await theaterUser.save();
    }

      res.status(201).json({
        message: "image uploaded",
        profilePhoto: result.secure_url,

      });
    } catch (error) {
      console.log("error :>> ", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  } else {
    res.status(500).json({
      message: "file not supported",
    });
  }
  
}

export {uploadImage,backgroundPhoto, getAllTheatherUsers,registerTheater, getTheaterProfile, uploadTheaterPosts };
