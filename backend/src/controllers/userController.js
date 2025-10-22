import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import { generateAccessToken, generateRefreshToken } from "../utils/token.js"

// createUser
// loginUser
// updateUser
// deleteUser
// getUserByuserId
// getUsersBydept
// getUsersByrole
// assignStudentsToUser
// removeStudentsFromUser


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

        res.status(200).json({ success: true, user: users })

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

        res.status(200).json({ success: true, user: users })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const assignStudentsToUser = async (req, res) => {

}

const removeStudentsFromUser = async (req, res) => {

}

export {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getUserByuserId,
    getUsersByrole,
    getUsersBydept,
    assignStudentsToUser,
    removeStudentsFromUser,
    
}