import  User  from "../model/UserModel.js";


import { encryptPassword, verifyPassword } from "../unils/encryptPassword.js";
import { v2 as cloudinary } from "cloudinary";
import { issueToken } from "../unils/jwt.js";
import TheaterUserModel from "../model/TheaterUserModel.js";

const getAllUsers = async (req, res) => {
  console.log("route running");
  try {
    const users = await User.find({});
    if (users && users.length > 0) {
      return res.json({
        number: users.length,
        users: users,
      });
    } else {
      return res.json({
        message: "No users found.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      errorMessage: "Internal server error.",
    });
  }
};

const register = async (req, res) => {
  console.log("register user controller working ");
  console.log(req.body);
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    const existingTheaterUser = await TheaterUserModel.findOne({ email: req.body.email });

    if (existingUser || existingTheaterUser) {
      res.status(203).json({
        message: "Email already exists",
      });
   
    } else {
      const hashedPassword = await encryptPassword(req.body.password);
      if (hashedPassword) {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        });

        const savedUser = await newUser.save();
        console.log("savedUser :>> ", savedUser);
        // if (savedUser) {
        //   const user = savedUser
        //   const token =  issueToken(user._id);
        //   if (token) {
        //     res.status(200).json({
        //       message: "user succsefully logged in",
        //       user: {
        //         userName: user.name,
        //         email: user.email,
        //         userId: user._id,
               

        //       },
        //       token
        //     })
            
        //   } else {
        //     res.status(400).json({
        //       message:"someting went wrong"
        //     })
        //   }
        // }

        res.status(201).json({
          message: "user registered",
          savedUser,
        });
      } else {
        res.status(500).json({
          message: Error,
        });
      }
    }
  } catch (error) {
    console.log("error :>> ", error);
  }
};

const imageUpload = async (req, res) => {
  console.log('req.user :>> ', req.user);
  console.log("route working");
  console.log("req.file :>> ", req.file);
  const { email } = req.body
  console.log('req.body :>> ', req.body);
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_image",
      });
      console.log("result uploading :>> ", result);
      // const user = await User.findOne(email); 
      const user=req.user
    if (user) {
      user.profilePhoto = result.secure_url;
      await user.save();
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
};
const login = async (req, res) => {
  console.log("login working");
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      message: "password or email are missing",
    });
  } else {
    try {
      const existingUser = await User.findOne({ email: email });
      const existingTheaterUser = await TheaterUserModel.findOne({ email: req.body.email });
      // console.log(existingUser, existingTheaterUser)
      if (!existingUser && !existingTheaterUser) {
        res.status(400).json({
          message: "do you have an account?",
        });
      }
      
      if (existingUser || existingTheaterUser) {
        const user = existingUser || existingTheaterUser
        console.log(user)
        const isPasswordValid = await verifyPassword(
          req.body.password,
          user.password
        );
        if (!isPasswordValid) {
          res.status(400).json({
            message: "wrong password",
          });
        }
        if (isPasswordValid) {
         
          const token =  issueToken(user._id);
          if (token) {
            res.status(200).json({
              message: "user succsefully logged in",
              user: {
                userName: user.name,
                email: user.email,
                userId: user._id,
               

              },
              token
            })
            
          } else {
            res.status(400).json({
              message:"someting went wrong"
            })
          }
        }
      }
    } catch (error) {
      console.log("error :>> ", error);
      res.status(400).json({
        message: "something went wrong",
      });
    }
  }
};

const getUserProfile = async (req, res) => {
  console.log("getUserProfile is running");
  console.log('req.user :>> ', req.user);
  if (req.user) {
    res.status(200).json({
      message: "user profile",
      user: {
        id: req.user._id,
        email: req.user.email,
        userName: req.user.name,
        profilePhoto: req.user.profilePhoto,
        posts: req.user.posts,
        quote: req.user.quote,
        about: req.user.about,
        favorites:req.user.favorites
         
      }
    })
    
  }
  if (!req.user) {
    res.status(400).json({
      message:"something went wrong, login one more time"
    })
    
  }
}


const updateProfile = async (req, res) => {
  console.log("update profile is working");
  console.log('req :>> ', req);
  

  const { name, email, password, profilePhoto,quote,about } = req.body;
  console.log(req.user)
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await User.updateOne({ email: req.user.email }, { name, email, password, profilePhoto,quote,about });

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};
const uploadPosts = async(req,res) => {
  console.log('uploadposts working');
  console.log('req.file :>> ', req.file);
 
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

const deleteAccount = async (req, res) => {
  console.log("deleteAccount works");
  console.log('req.user :>> ', req.user);
  const user = req.user;

  try {
    if (!user) {
      return res.status(401).json({
        message: "Please log in first"
      });
    }

    const deletedUser = await User.findOneAndDelete({ _id: user._id });

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      message: "User deleted successfully"
    });
  } catch (error) {
    console.log('error :>> ', error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later."
    });
  }
};

const deletePost = async (req, res) => {
  const user = req.user
  console.log('user.posts :>> ', req.user.posts);
  const postId = req.body._id
  console.log('postId :>> ', postId);
 try {
    if (!user) {
      return res.status(401).json({
        message: "Please log in first"
      });
    }

    const postIndex = user.posts.findIndex(post => post._id.toString() === postId);

    if (postIndex === -1) {
      return res.status(404).json({
        message: "Post not found"
      });
    }
    user.posts.splice(postIndex, 1);

    await user.save();

    return res.status(200).json({
      message: "Post deleted successfully"
    });
  } catch (error) {
    console.log('error :>> ', error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later."
    });
  }
}

const likePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.body.postId; 
    const user = req.user;

    if (!userId) {
      return res.status(401).json({
        message: "Login first"
      });
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const post = user.posts.find(post => post._id.toString() === postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    const alreadyLikedIndex = post.likes.indexOf(userId);

    if (alreadyLikedIndex !== -1) {
      post.likes.splice(alreadyLikedIndex, 1);
    } else {
      post.likes.push(userId);
    }

    await user.save();

  
    res.status(200).json({
      message: alreadyLikedIndex !== -1 ? "Like removed successfully" : "Post liked successfully",
      updatedPost: post ,
      number : post.likes.length
    });
    
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong"
    });
  }
};

const commentPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = req.user;
    const commentText = req.body.text;
    const postId = req.body.postId;

    if (!userId || !user) {
      return res.status(401).json({
        message: "Unauthorized. Please log in first."
      });
    }

    const post = user.posts.find(post => post._id.toString() === postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    const newComment = {
      user: userId,
      text: commentText
    };

    post.comments.push(newComment);
    await user.save();

    return res.status(201).json({
      message: "Comment added successfully",
      updatedPost: post
    });

  } catch (error) {
    console.error(error); 
    return res.status(400).json({
      message: "Something went wrong"
    });
  }
};


const deleteComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = req.user;
    const postId = req.body.postId;
    const commentId = req.body.commentId; 

    if (!userId) {
      return res.status(401).json({
        message: "Login first"
      });
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const post = user.posts.find(post => post._id.toString() === postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);

    if (commentIndex === -1) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    const commentToDelete = post.comments[commentIndex];
    console.log('commentToDelete.user :>> ', commentToDelete.user);
    console.log('userId :>> ', userId);

    if  (commentToDelete.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this comment"
      });
    }

    post.comments.splice(commentIndex, 1);

    await user.save();

    res.status(200).json({
      message: "Comment deleted successfully",
      updatedPost: post 
    });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong"
    });
  }
};

const favoritePosts = async (req, res) => {
  try {
    const user = req.user;
    const postId = req.body.postId;

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    const postIndex = user.favorites.findIndex(favorite => favorite.toString() === postId);

    if (postIndex !== -1) {
      
      user.favorites.splice(postIndex, 1);

      await user.save();

      return res.status(200).json({
        message: "Post removed from favorites successfully"
      });
    } else {
      
      user.favorites.push(post);

      await user.save();

      return res.status(200).json({
        message: "Post added to favorites successfully"
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong"
    });
  }
};


export { getAllUsers,favoritePosts ,register, imageUpload, login, getUserProfile,updateProfile,uploadPosts,deleteAccount,deletePost,likePost, commentPost,deleteComment};
