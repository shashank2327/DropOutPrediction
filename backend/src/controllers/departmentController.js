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

//createDept
//DeleteDept
//UpdateDept
//getallDept

export const getallDept = async (req, res) => {
    try {
        const departments = await Department.find({})
            .populate('hod', 'firstName lastName email'); 
        res.status(200).json({ success: true, departments });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const createDept = async(req, res) => {
   try {
     const {name, code, hod} = req.body;
     if(!name || !code) {
         return res.status(400).json({success: false, message: "Provide complete details"})
     }
     const existDept = await Department.findOne({code})
     if(existDept){
         return res.status(409).json({success: false, message: "Department already created"})
     }
     const newDept = await Department.create({
         name, code, hod
     })
     res.status(201).json({success: true, dept: newDept, message: "Department Created Successfully"})
   } catch (error) {
     console.log(error);
     res.status(500).json({ success: false, message: error.message });
   }
}

export const UpdateDept = async(req, res) => {
    try {
        const { name, code, hod } = req.body
        const updatedDepartment = await Department.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedDepartment) {
            return res.status(404).json({ success: false, message: "Department not found." });
        }

        res.status(200).json({ success: true, message: "Department updated.", dept: updatedDepartment });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const DeleteDept = async (req, res) =>{
    try {
        const {id} = req.params
        const courseCount = await Course.countDocuments({ department: id });
        if (courseCount > 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot delete. Department is linked to active courses." 
            });
        }
        const deletedDepartment = await Department.findByIdAndDelete(id);
        if (!deletedDepartment) {
            return res.status(404).json({ success: false, message: "Department not found." });
        }
        res.status(200).json({ success: true, message: "Department deleted." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
