import jwt from 'jsonwebtoken'
import Student from '../models/student.model.js'

export const AuthStudent = async (req, res, next) => {
    try {
        const token = req.headers.accesstoken
        if(!token) {
            return res.status(401).json({success: false, message: "Unauthorized; No token provided"})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const student = await Student.findById(decoded.id).select("-password")
        if(!student) {
            return res.status(404).json({success: false, message: "Student not found"})
        }
        req.student = student
        next()
    } catch (error) {
        console.log(error)
        return res.status(403).json({success: false, message: "Forbidden Invalid token"})
    } 
}