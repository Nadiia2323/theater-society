
import TheaterUserModel from "../model/TheaterUserModel.js";
import User from "../model/UserModel.js";
import Post from "../model/PostModel.js";
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
  const { caption } = req.body; 

  if (req.file) {
    try {
      
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "posts",
      });

      
      const newPost = new Post({
        imageUrl: result.secure_url,
        caption: caption,
        user: req.user._id 
      });
      await newPost.save();

      
      const user = await TheaterUserModel.findById(req.user._id);
      user.posts.unshift(newPost._id);
      await user.save();

      // Send the response
      res.status(201).json({
        message: "post uploaded",
        post: newPost
      });

    } catch (error) {
      console.error("Error uploading post:", error);
      res.status(500).json({ error: "Failed to upload post" });
    }
  } else {
    res.status(400).json({ 
      message: "No file provided",
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

const updateTheaterProfile = async (req, res) => {
  
  console.log("update  theater profile is working");
  console.log('user :>> ', req.user);
 
  

  const { name, email, profilePhoto,quote,about,country,city,director } = req.body;
  
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await TheaterUserModel.updateOne({ email: req.user.email }, { name, email, profilePhoto,quote,about,country,city,director });

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Server error" });
  }

  
}

const addActors = async(req, res) => {
  console.log('addActors :>> ');
  try {
    const theaterId = req.user._id; 
    console.log('theaterId :>> ', theaterId);
    const userId = req.body.userId; 
    console.log('userId :>> ', userId);

    const theater = await TheaterUserModel.findById(theaterId);
    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    const isAlreadyActor = theater.actors.includes(userId);

    if (isAlreadyActor) {
      
      theater.actors = theater.actors.filter(actorId => actorId.toString() !== userId);
      await theater.save();
      return res.status(200).json({ message: "Actor removed from the cast", actors: theater.actors });
    } else {
      
      theater.actors.push(userId);
      await theater.save();
      return res.status(200).json({ message: "Actor successfully added to the cast", actors: theater.actors });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const getCast = async (req, res) => {
  try {
    const theaterId = req.user._id; 

    
    const theater = await TheaterUserModel.findById(theaterId).populate('actors');

   
    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    
    res.status(200).json({
      message: "Cast retrieved successfully",
      cast: theater.actors
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error occurred while retrieving the cast" });
  }
};


export {getCast,addActors,updateTheaterProfile,uploadImage,backgroundPhoto, getAllTheatherUsers,registerTheater, getTheaterProfile, uploadTheaterPosts };
