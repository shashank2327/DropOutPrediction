import Student from "../models/student.model.js"
import User from "../models/user.model.js"
import Attendance from '../models/attendance.model.js'
import AcademicRecord from '../models/academicRecord.model.js'
import FeeRecord from '../models/feeRecord.model.js'
import Subject from '../models/subject.model.js'
import Prediction from '../models/prediction.model.js'
import Alert from '../models/alert.model.js'

import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

// Student
// loginStudent
// SignUpStudent
// updateMyProfile
// getMyAttendance
// getMyAcademicRecords
// getMyFeeRecords

// Admin 
// getAllStudents
// getStudentById
// updateStudent
// deleteStudent

const registerStudent = async(req, res) => {
    try {
        const {firstName, lastName, email, password, phone, age, department, course, batch} = req.body
        if(!firstName || !lastName || !email || !password || !department || !course) {
            return res.status(400).json({success: false, message: "Missing Required Details"})
        }
        const student = await Student.findOne({email})
        if(student) {
            return res.status(409).json({success: false, message: "Student with this email already exists"})
        }
        const salt = await bcrypt.genSalt(10)
        const encryptpass = await bcrypt.hash(password, salt)
        const newStudent = await Student.create({
            firstName,
            lastName,
            email,
            password: encryptpass,
            phone,
            age,
            department,
            course,
            batch
        })
        if(!newStudent){
            return res.status(400).json({success: false, message: "Cannot create a user"})
        }
        const accesstoken = generateAccessToken(newStudent._id)
        const refreshtoken = generateRefreshToken(newStudent._id)
 
        res.status(201).json({success: true, student: newStudent, accesstoken, refreshtoken, message: "Student registered Successfully!!"})

    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: error.message})
    }
}

const loginStudent = async (req, res) => {
    try {
        const {email, password} = req.body
        const student = await Student.findOne({email})
        if(!student) {
            return res.status(401).json({success: false, message: "No user exists."})
        } 
        const isPassword = await bcrypt.compare(password, student.password)
        if(!isPassword){
            return res.status(401).json({success: false, message: "Incorrect Credentials."})
        }
        const accesstoken = generateAccessToken(student._id)
        const refreshtoken = generateRefreshToken(student._id)
 
        res.status(200).json({success: true, student, accesstoken, refreshtoken, message: "Student Logged In Successfully!!"})

    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: error.message})
    }
}

const updateStudentProfile = async (req, res) => {
    try {
        const studentId = req.student._id
        const {age, phone, profile} = req.body
        
        const student = await Student.findById(studentId)
        if(!student) {
            return res.status(404).json({success: false, message: "Student not found"})
        }
        if(phone) student.phone = phone
        if(age) student.age = age

        if(profile) {
            if(profile.bio) {
                student.profile.bio = profile.bio
            }
            if(profile.avatar) {
                student.profile.avatar = profile.avatar
            }
        }

        const updatedStudent = await student.save()
        res.status(200).json({success: true, student: updatedStudent, message: "Profile Updated Successfully!!"})

    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: error.message})
    }
}

const getMyAttendance = async (req, res) => {
    try {
        const studentId = req.student._id

        const attendanceRecords = await Attendance.find({student: studentId}).populate('subject', 'name code').sort({date: -1})
        
        res.status(200).json({success: true, attendance: attendanceRecords})

    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: error.message})
    }
}

const getMyAcademicRecords = async (req, res) => {
    try {
        const studentId = req.student._id
        const academicRecords = await AcademicRecord.find({student: studentId}).populate('subject', 'name code').sort({semester: 1})
        res.status(200).json({success: true, academics: academicRecords})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: error.message})
    }
}


const getMyFeeRecords = async (req, res) => {
    try {
        const studentId = req.student._id
        const feeRecords = await FeeRecord.find({student: studentId}).sort({paymentDate: -1})
        res.status(200).json({success: true, fees: feeRecords})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: error.message})
    }
}


//Admin Permissions (Teachers, mentors)
const getAllStudents = async (req, res) => {
    try {
        const {department, course} = req.query
        const query = {}
        
        if(department) query.department = department
        if(course) query.course = course
        
        const students = await Student.find(query).select("-password").populate('department', 'name').populate('course', 'name')
        res.status(200).json({success: true, student: students})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: error.message})
    }
}

const getStudentById = async(req, res) => {
    try {
        const {id} = req.params
        const student = await Student.findById(id).select("-password").populate('department', 'name').populate('course', 'name')
        if(!student) {
            return res.status(404).json({success: false, message: "Student not found!!"})
        }

        const attendance = await Attendance.find({student: id}).populate('subject', 'name').sort({date: -1})

        const academics = await AcademicRecord.find({student: id}).populate('subject', 'name code').sort({semester: 1})

        const fees = await FeeRecord.find({student: id}).sort({paymentDate: -1})

        res.status(200).json({success: true, student, records: {attendance: attendance, academics: academics, fees: fees}})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: error.message})
    }
}

const updateStudent = async (req, res) => {
   try {
       const {id} = req.params
       const {department, course, batch, currentSem, mentor} = req.body
       const student = await Student.findById(id).select("-password")
       if(!student) {
        return res.status(404).json({success: false, message: "Student not found"})
       } 
       if(department) student.department = department
       if(course) student.course = course
       if(batch) student.batch = batch
       if(currentSem) student.currentSem = currentSem
       if(mentor) student.mentor = mentor
       const updatedStudent = await student.save()
       res.status(200).json({success: true, student: updateStudent, message: "Student Updated Successfully!!"})

   } catch (error) {
    console.log(error)
    res.status(500).json({success: false, message: error.message})
   }
}

const deleteStudent = async (req, res) => {
    try {
        const {id} = req.params
        const deleteStudent = await Student.findByIdAndDelete(id)
        if(!deleteStudent){
            return res.status(404).json({success: false, message: "Student not found"})
        }
        await Attendance.deleteMany({student: id})
        await AcademicRecord.deleteMany({student: id})
        await FeeRecord.deleteMany({student: id})
        await Prediction.deleteMany({student: id})
        await Alert.deleteMany({student: id})

        if(deleteStudent.mentor) {
            await User.findByIdAndUpdate(
                deleteStudent.mentor,
                {$pull: {assignedStudents: id}}
            )
        }
        res.status(200).json({success: true, message: "Student record Deleted Successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: error.message})
    }
}

export {
    registerStudent, 
    loginStudent,
    updateStudentProfile,
    getMyAttendance,
    getMyAcademicRecords,
    getMyFeeRecords,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
}