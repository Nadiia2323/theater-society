import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import User from "../model/UserModel.js";

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : "qwertyuiop1234567890",

}

const jwtStrategy = new JwtStrategy(jwtOptions,async function (jwt_payload, done) {
    
    try {
        const user = await User.findOne({ _id: jwt_payload.sub })
        if (user) {
            console.log("token valid,user inserted" );
            return done(null,user)
        }
        if (!user) {
            console.log("token invalid");
            return done(null,false)
            
        }
    } catch (error) {
        console.log(error);
         return done(err,false)
        }
    }
    // User.findOne({ _id: jwt_payload.sub }, function (err, user) {
    //     if (err) {
    //         return done(err,false)
    //     }
    //     if (user) {
    //         return done(null,user)
            
    //     } else {
    //         return done(null, false)
    //         //you could creat a new accout
            
    //     }
    
)
const passportConfig = (passport) => {
  passport.use(jwtStrategy)
}
export default passportConfig