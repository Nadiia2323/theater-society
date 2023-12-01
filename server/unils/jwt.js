import jwt from "jsonwebtoken"

const issueToken = (userId) => {

    const signOptions = {
        expiresIn: "2 days",
        issuer:"Admin"
    };

    const payload = {
        sub: userId
    }
    const secretOrPrivatKey = process.env.MYKEY 


    const token = jwt.sign(payload, secretOrPrivatKey, signOptions) 
    
    return token;
}

export {issueToken}