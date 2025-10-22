import bcrypt from 'bcryptjs'
import { generateAccessToken, generateRefreshToken } from "../utils/token.js"
import Attendance from '../models/attendance.model.js'
import Subject from '../models/subject.model.js'
import Student from '../models/student.model.js'

const addAttendanceRecord = async (req, res) => {
    try {
        const {studentId, subjectId, date, status } = req.body
        const markedBy = req.user._id
        if(!studentId || !subjectId || !date) {
            return res.status(400).json({success: false, message: "Missing required fields"})
        } 
        const exists = await Attendance.find({student: studentId, subject: subjectId, date: date})
        if(exists){
            return res.status(409).json({success: false, message: "Attendance already marked"})
        }
        const newRecord = await Attendance.create({
            student: studentId,
            subject: subjectId,
            date: date,
            status: status,
            markedBy: markedBy
        })
        res.status(201).json({success: true, attendance: newRecord, message: "Attendance record created"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error.message})
    }
}

const getAttendance = async (req, res) => {
    try {
        const {subjectId, studentId, date} = req.query
        const query = {}
        if (subjectId) query.subject = subjectId;
        if (studentId) query.student = studentId;
        if (date) query.date = date;
        const records = await Attendance.find(query)
            .populate('student', 'firstName lastName')
            .populate('subject', 'name code')
            .sort({ date: -1 });

        res.status(200).json({ success: true, records });
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error.message})
    }
}

const UpdateAttendance = async (req, res) => {
    try {
        const {id} = req.params
        const {status} = req.body
        if (!status) {
            return res.status(400).json({ success: false, message: "New status is required." });
        }
        const updatedRecord = await Attendance.findByIdAndUpdate(
            id,
            { status: status },
            { new: true, runValidators: true }
        );

        if (!updatedRecord) {
            return res.status(404).json({ success: false, message: "Attendance record not found." });
        }

        res.status(200).json({ success: true, message: "Record updated.", record: updatedRecord });

    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error.message})
    }
}

const deleteAttendance = async (req, res) => {
     try {
        const { id } = req.params;
        const deletedRecord = await Attendance.findByIdAndDelete(id);
        if (!deletedRecord) {
            return res.status(404).json({ success: false, message: "Attendance record not found." });
        }
        res.status(200).json({ success: true, message: "Record deleted." });
     } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error.message})
     }
}

export {
    deleteAttendance,
    UpdateAttendance,
    getAttendance,
    addAttendanceRecord
}