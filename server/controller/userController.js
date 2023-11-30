import User from "../model/UserModel.js";
import { encryptPassword, verifyPassword } from "../unils/encryptPassword.js";
import { v2 as cloudinary } from "cloudinary";

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
    if (existingUser) {
      res.status(203).json({
        message: "Email alredy exist",
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
  console.log("route working");
  console.log("req.file :>> ", req.file);
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_image",
      });
      console.log("result uploading :>> ", result);

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
      if (!existingUser) {
        res.status(400).json({
          message: "do you have an account?",
        });
      }
      
      if (existingUser) {
        const isPasswordValid = await verifyPassword(
          req.body.password,
          existingUser.password
        );
        if (!isPasswordValid) {
          res.status(400).json({
            message: "wrong password",
          });
        }
        if (isPasswordValid) {
          res.status(200).json({
            message: "password correct",
          });
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

export { getAllUsers, register, imageUpload, login };
