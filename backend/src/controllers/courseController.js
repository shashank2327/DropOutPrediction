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
import Department from "../models/department.model.js"
import Course from '../models/course.model.js'

//getallStudentCourse
//CreateCourse
//UpdateCourse
//DeleteCourse

export const createCourse = async (req, res) => {
    try {
        const { name, specialization, code, duration, department } = req.body;

        if (!name || !code || !duration || !department) {
            return res.status(400).json({ success: false, message: "Name, code, duration, and department are required." });
        }

        const existingCourse = await Course.findOne({ code });
        if (existingCourse) {
            return res.status(409).json({ success: false, message: "Course code already exists." });
        }

        const newCourse = await Course.create({
            name,
            specialization,
            code,
            duration,
            department
        });

        res.status(201).json({ success: true, message: "Course created.", course: newCourse });
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message})
    }
}

export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({})
            .populate('department', 'name code')
        res.status(200).json({ success: true, course: courses });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }

        res.status(200).json({ success: true, message: "Course updated.", course: updatedCourse });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const {id} = req.params
        const studentCount = await Student.countDocuments({course: id})
        if(studentCount) {
            return res.status(400).json({success: false, message: "Students are currently enrolled in the course"})
        }
        const subjectCount = await Subject.countDocuments({course: id})
        if(subjectCount) {
            return res.status(400).json({success: false, message: "Subjects are currently linked in the course"})
        }
        const deletedCourse = await Course.findByIdAndDelete(id)
        if(!deletedCourse) {
            return res.status(404).json({success: false, message: "Course not found"})
        }
        res.status(200).json({ success: true, message: "Course deleted" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}