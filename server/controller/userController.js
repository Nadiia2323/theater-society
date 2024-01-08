import User from "../model/UserModel.js";
import Post from "../model/PostModel.js";


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

const getUser = async (req, res) => {
    
    try {
      const userId = req.params.userId;
      console.log('userId :>> ', userId);
        
        const userById = await User.findById(userId).populate('posts');
        console.log('userById :>> ', userById);

        if (userById) {
            res.status(200).json(userById);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error :>> ', error);
        res.status(500).send('Server error');
    }
};

const getAllPosts = async(req,res) => {
  try {
    const allPosts = await Post.find({})
    if (allPosts && allPosts.length > 0) {
      return res.json({
        number: allPosts.length,
        users: allPosts,
      });
    } else {
      return res.json({
        message: "No posts found.",
      });
    }
  } catch (error) {
    console.log(err);
    return res.status(500).json({
      errorMessage: "Internal server error.",
    });
  }
}

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
  try {
    const user = await User.findById(req.user._id).populate('posts');
    const theaterUser = await TheaterUserModel.findById(req.user._id);

    if (user) {
      res.status(200).json({
        message: "user profile",
        user: {
          id: user._id,
          email: user.email,
          userName: user.name,
          profilePhoto: user.profilePhoto,
          posts: user.posts,
          quote: user.quote,
          about: user.about,
          favorites: user.favorites,
          followers: user.followers,
          following: user.following
        }
      });
    } else if (theaterUser) {
      res.status(200).json({
        message: "theater profile",
        theater: {
          id: theaterUser._id,
            theaterName: theaterUser.theaterName,
            email: theaterUser.email,
          profilePhoto: theaterUser.profilePhoto,
          country: theaterUser.country,
          city: theaterUser.city,
          quote: theaterUser.quote,
          about: theaterUser.about,
          actors: theaterUser.actors,
          director: theaterUser.director,
          repertoire: theaterUser.gallery,
          followers: theaterUser.followers,
          following: theaterUser.following
            
        }
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error('Error :>> ', error);
    res.status(500).json({
      message: "Something went wrong, please try again"
    });
  }
};



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
const uploadPosts = async(req, res) => {
  console.log('uploadposts working');
  console.log('req.file :>> ', req.file);

  const { caption } = req.body; 
  
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "posts",
      });
      console.log("result uploading :>> ", result);

      
      const newPost = new Post({
        imageUrl: result.secure_url,
        caption: caption,
        user: req.user._id  
      });

     
      await newPost.save();

      
      const user = await User.findById(req.user._id);
      user.posts.push(newPost._id);
      await user.save();

      res.status(201).json({
        message: "post uploaded",
        post: newPost,
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
};


const deleteAccount = async (req, res) => {
  console.log("deleteAccount works");
  const user = req.user;

  try {
    if (!user) {
      return res.status(401).json({ message: "Please log in first" });
    }

    

    const deletedUser = await User.findOneAndDelete({ _id: user._id });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log('error :>> ', error);
    return res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};


const deletePost = async (req, res) => {
  const user = req.user;
  const postId = req.body._id;

  try {
    if (!user) {
      return res.status(401).json({ message: "Please log in first" });
    }

    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

   
    if (post.user.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    const postToDelete = await Post.findByIdAndDelete(postId);
   
   
    const postIndex = user.posts.findIndex(p => p.toString() === postId);
    if (postIndex > -1) {
      user.posts.splice(postIndex, 1);
      await user.save();
    }

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log('error :>> ', error);
    return res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};


const likePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.body.postId;

    if (!userId) {
      return res.status(401).json({ message: "Login first" });
    }

    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!post || !user) {
      return res.status(404).json({ message: "Post or User not found" });
    }

    const alreadyLikedIndex = post.likes.indexOf(userId);

    if (alreadyLikedIndex !== -1) {
      post.likes.splice(alreadyLikedIndex, 1);
      
      const favoriteIndex = user.favorites.indexOf(postId);
      if (favoriteIndex !== -1) {
        user.favorites.splice(favoriteIndex, 1);
      }
    } else {
      post.likes.push(userId);
      
      if (!user.favorites.includes(postId)) {
        user.favorites.push(postId);
      }
    }

    await post.save();
    await user.save();

    res.status(200).json({
      message: alreadyLikedIndex !== -1 ? "Like removed successfully" : "Post liked successfully",
      updatedLikes: post.likes.length,
      favorites: user.favorites
    });

  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};




const commentPost = async (req, res) => {
  
  try {
    const userId = req.user._id;
    const commentText = req.body.text;
    const postId = req.body.postId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. Please log in first."
      });
    }

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    // Create a new comment
    const newComment = {
      user: userId,
      text: commentText,
      createdAt: new Date() // Setting the creation date
    };

    // Add the comment to the post's comments array
    post.comments.push(newComment);
    await post.save();

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
    const postId = req.body.postId;
    const commentId = req.body.commentId;

    if (!userId) {
      return res.status(401).json({
        message: "Login first"
      });
    }

    
    const post = await Post.findById(postId);

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

    const comment = post.comments[commentIndex];
    if (comment.user.toString() !== userId.toString() && post.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this comment"
      });
    }

   
    post.comments.splice(commentIndex, 1);
    await post.save();

    return res.status(200).json({
      message: "Comment deleted successfully",
      updatedPost: post
    });

  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Something went wrong"
    });
  }
};


// const favoritePosts = async (req, res) => {
//   try {
//     const user = req.user;
//     const postId = req.body.postId;

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found"
//       });
//     }

    
//     const post = await Post.findById(postId);

//     if (!post) {
//       return res.status(404).json({
//         message: "Post not found"
//       });
//     }

//     const postIndex = user.favorites.findIndex(favorite => favorite.toString() === postId);

//     if (postIndex !== -1) {
      
//       user.favorites.splice(postIndex, 1);

//       await user.save();

//       return res.status(200).json({
//         message: "Post removed from favorites successfully"
//       });
//     } else {
      
//       user.favorites.push(post);

//       await user.save();

//       return res.status(200).json({
//         message: "Post added to favorites successfully"
//       });
//     }
//   } catch (error) {
//     res.status(400).json({
//       message: "Something went wrong"
//     });
//   }
// };

const getFavorites = async (req, res) => {
  console.log('favorites working ');
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    
    const populatedUser = await User.findById(user._id).populate('favorites');

    if (!populatedUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    
    const favoritePosts = populatedUser.favorites;

    res.status(200).json({
      message: "Favorites retrieved successfully",
      number:favoritePosts.length,
      favorites: favoritePosts
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong"
    });
  }
};
const following = async (req, res) => {
  try {
    const userId = req.user._id;
    const targetUserId = req.body.targetUserId;

    if (userId === targetUserId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

   
    const user = await User.findById(userId);
    const isAlreadyFollowing = user.following.includes(targetUserId);

    if (isAlreadyFollowing) {
     
      await User.findByIdAndUpdate(userId, {
        $pull: { following: targetUserId }
      });
      await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: userId }
      });
      res.status(200).json({ message: "Successfully unfollowed user" });
    } else {
      
      await User.findByIdAndUpdate(userId, {
        $addToSet: { following: targetUserId }
      });
      await User.findByIdAndUpdate(targetUserId, {
        $addToSet: { followers: userId }
      });
      res.status(200).json({ message: "Successfully followed user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
 const searchUser = async(req,res) => {
   console.log('searchworking ');
   console.log('object :>> ', req.query.q);
   try {
    const searchQuery = req.query.q;
     const users = await User.find({ name: new RegExp(searchQuery, 'i') });
     if (users.length === 0) {
  return res.status(404).json({ message: 'No users found' });
}
     if (users) {
      res.json(users);
     }
    
  } catch (error) {
    res.status(500).json({ message: 'something went wrong' });
  }
 }
//not working yet//
const getFollowers = async (req,res) => {
  console.log('getfollowers');
 try {
    
   const userId = req.user._id;
   console.log('userId :>> ', userId);

    
   const user = await User.findById(userId).populate('following')
  .populate('followers');
   if (!user) {
  return res.status(404).json({ message: 'User not found' });
}

    
   const followingUsers = user.followers;
   console.log('followingUsers :>> ', followingUsers);

    
    res.json(followingUsers);
  } catch (error) {
  console.error("Error: ", error);
  res.status(500).json({ message: 'Error fetching following users' });
}
}

export {getAllPosts,getFollowers,searchUser,following ,getUser,getFavorites, getAllUsers,register, imageUpload, login, getUserProfile,updateProfile,uploadPosts,deleteAccount,deletePost,likePost, commentPost,deleteComment};
