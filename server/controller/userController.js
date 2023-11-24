
import User from "../model/UserModel.js";
import { encryptPassword } from "../unils/encryptPassword.js";

const getAllUsers = async (req, res) => {
    console.log('route running');
    try {
        const users = await User.find({});
        if (users && users.length > 0) {
            return res.json({
                number: users.length,
                users: users
            });
        } else {
            return res.json({
                message: 'No users found.'
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            errorMessage: 'Internal server error.'
        });
    }
};

const register = async  (req, res) => {
    console.log('register controller working ');
    console.log(req.body)
    try {
         const existingUser = await User.findOne({ email: req.body.email })
    if (existingUser) {
        res.status(203).json({
            message: "Email alredy exist"
        })
    } else {
        const hashedPassword = await encryptPassword(req.body.password)
    if (hashedPassword) {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });
        
        const savedUser = await newUser.save();
        console.log('savedUser :>> ', savedUser);

        res.status(201).json({
            message: "user registered",
            savedUser,
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

export { getAllUsers, register };
