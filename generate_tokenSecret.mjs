import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

function generateAccessToken(userid) {
    return jwt.sign({userid}, process.env.TOKENSECRET, { expiresIn: '1800s' });
}

export default generateAccessToken