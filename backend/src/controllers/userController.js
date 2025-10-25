import User from "../models/user.model.js"
import Student from "../models/student.model.js"
import Attendance from "../models/attendance.model.js"
import AcademicRecord from "../models/academicRecord.model.js"
import FeeRecord from "../models/feeRecord.model.js"
import bcrypt from 'bcryptjs'
import { generateAccessToken, generateRefreshToken } from "../utils/token.js"
import Alert from "../models/alert.model.js"

// createUser
// loginUser
// updateUser
// deleteUser
// getUserByuserId
// getUsersBydept
// getUsersByrole
// getmyAssignedStudents


const createUser = async (req, res) => {
    const { firstName, lastName, email, password, role, department, age, phone, profile } = req.body
    try {
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ success: false, message: "Missing Credentials. Enter details correctly." })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(409).json({ success: false, message: "User already exists." })
        }

        const salt = await bcrypt.genSalt(10)

        const encryptpass = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            firstName, lastName, password: encryptpass, email, role, department, age, phone, profile
        })

        const accesstoken = generateAccessToken(newUser._id)
        const refreshtoken = generateRefreshToken(newUser._id)

        res.json({ success: true, user: newUser, accesstoken, refreshtoken, message: "User Created Successfully!!" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid Credentials" })
        }
        const isPassword = await bcrypt.compare(password, user.password)
        if (!isPassword) {
            return res.status(401).json({ success: false, message: "Invalid Credentials" })
        }
        const accesstoken = generateAccessToken(user._id)
        const refreshtoken = generateRefreshToken(user._id)
        res.json({ success: true, user, accesstoken, refreshtoken, message: "Logged In Successfully!!" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, profile, department, age, phone } = req.body
        const user = req.user._id
        const updateData = {}
        if (firstName) updateData.firstName = firstName
        if (lastName) updateData.lastName = lastName
        if (age) updateData.age = age
        if (phone) updateData.phone = phone
        if (department) updateData.department = department
        if (profile) {
            if (profile.designation !== undefined) updateData['profile.designation'] = profile.designation;
            if (profile.qualification !== undefined) updateData['profile.qualification'] = profile.qualification;
            if (profile.specialization !== undefined) updateData['profile.specialization'] = profile.specialization;
            if (profile.bio !== undefined) updateData['profile.bio'] = profile.bio;
            if (profile.avatar !== undefined) updateData['profile.avatar'] = profile.avatar;
        }
        const updatedUser = await User.findByIdAndUpdate(
            user,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password")

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        res.status(200).json({ success: true, user: updatedUser, message: "Profile updated successfully" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = req.user._id
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        const deleteUser = await User.findByIdAndDelete(user)
        if (!deleteUser) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        res.status(200).json({ success: true, message: "User deleted successfully!!" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const getUserByuserId = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id).select("-password")
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        res.status(200).json({ success: true, user, message: "User Details fetched successfully!!" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const getUsersBydept = async (req, res) => {
    try {
        const { dept } = req.query
        if (!dept) {
            return res.status(400).json({ success: false, message: "Department is required in the body." });
        }
        const users = await User.find({ department: dept }).select("-password")
        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: "No users found for this department" })
        }

        res.status(200).json({ success: true, users: users })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const getUsersByrole = async (req, res) => {
    try {
        const { role } = req.query
        if (!role) {
            return res.status(404).json({ success: false, message: "Role is required as a parameter" })
        }
        const users = await User.find({ role: role }).select("-password")
        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: "No users found for this role" })
        }

        res.status(200).json({ success: true, users: users })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const getMyAssignedStudents = async (req, res) => {
    try {
        const id = req.user._id
        const user = await User.findById(id)
        if(!user) {
            return res.status(404).json({success: false, message: "Mentor not found"})
        }
        const studentIds = user.assignedStudents
        if(!studentIds || studentIds.length === 0) {
            return res.status(200).json({success: true, student: []})
        }
        const students = await Student.find({
            _id: {$in: studentIds}
        }).select("-password").populate('course', 'name').populate('department', 'name').lean()
        
        const allattendance = await Attendance.find({student: {$in: studentIds}}).populate('subject', 'name code')

        const allacademics = await AcademicRecord.find({student: {$in: studentIds}}).populate('subject', 'name')

        const allfees = await FeeRecord.find({student: {$in: studentIds}})
        
        const studentDetails = students.map(student =>  {
            const studentIdString = student._id.toString()
            const attendance = allattendance.filter(record => record.student.toString() === studentIdString)
            const academics = allacademics.filter(record => record.student.toString() === studentIdString)
            const fees = allfees.filter(record=> record.student.toString() === studentIdString)

            return {
                ...student,
                records: {
                    attendance: attendance,
                    academics: academics,
                    fees: fees
                }
            }
        })

        res.status(200).json({success: true, students: studentDetails})

    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: error.message})
    }

}

const getmyAlerts = async (req, res) => {
    try {
        const facultyId = req.user._id
        const alerts = await Alert.find({assignedTo: facultyId}).populate('student', 'firstName lastName')
        res.status(200).json({success: true, alerts})
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getUserByuserId,
    getUsersByrole,
    getUsersBydept,
    getMyAssignedStudents,
    getmyAlerts
}