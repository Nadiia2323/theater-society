import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import User from "../model/UserModel.js";
import TheaterUserModel from "../model/TheaterUserModel.js";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "qwertyuiop1234567890",
};

const jwtStrategy = new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
  try {
    const user = await User.findOne({ _id: jwt_payload.sub });
    if (user) {
      console.log("token valid, user authenticated");
      return done(null, user);
    }

    const theatreUser = await TheaterUserModel.findById(jwt_payload.sub);
    if (theatreUser) {
      console.log("token valid, theatre user authenticated");
      return done(null, theatreUser);
    }

    console.log("token invalid");
    return done(null, false);
  } catch (error) {
    console.log(error);
    return done(error, false);
  }
});

const passportConfig = (passport) => {
  passport.use(jwtStrategy);
};

export default passportConfig;










// import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
// import User from "../model/UserModel.js";
// import TheaterUserModel from "../model/TheaterUserModel.js";

// const jwtOptions = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey : "qwertyuiop1234567890",

// }

// const jwtStrategy = new JwtStrategy(jwtOptions,async function (jwt_payload, done) {
    
//     try {
//         const user = await User.findOne({ _id: jwt_payload.sub })
//         const theatreUser = await TheaterUserModel.findById(jwt_payload.sub)
        
//         if (user) {
//             console.log("token valid,user inserted" );
//             return done(null,user)
//         }
//         if (!user) {
//             console.log("token invalid");
//             return done(null,false)
            
//         }
//     } catch (error) {
//         console.log(error);
//          return done(err,false)
//         }
//     }
//     // User.findOne({ _id: jwt_payload.sub }, function (err, user) {
//     //     if (err) {
//     //         return done(err,false)
//     //     }
//     //     if (user) {
//     //         return done(null,user)
            
//     //     } else {
//     //         return done(null, false)
//     //         //you could creat a new accout
            
//     //     }
    
// )
// const passportConfig = (passport) => {
//   passport.use(jwtStrategy)
// }
// export default passportConfig