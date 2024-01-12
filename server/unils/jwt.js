import jwt from "jsonwebtoken"

const issueToken = (userId, isTheaterUser) => {

    const signOptions = {
        expiresIn: "2 days",
        issuer:"Admin"
    };

    const payload = {
        sub: userId,
        isTheaterUser
    }
    const secretOrPrivatKey = process.env.MYKEY 


    const token = jwt.sign(payload, secretOrPrivatKey, signOptions) 
    
    return token;
}

export {issueToken}