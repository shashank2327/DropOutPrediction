import User from "../models/user.model.js"
import jwt from 'jsonwebtoken'

export const AuthUser = async(req, res, next) => {
    try {
        const token = req.headers.accesstoken
        if(!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided." });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select("-password")
        if(!user) {
            return res.json({success:false, message: "User Not Found"})
        }
        req.user = user
        next()

    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: error.message})
    }
}