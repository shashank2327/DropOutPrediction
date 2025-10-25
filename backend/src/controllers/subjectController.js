import Subject from '../models/subject.model.js';
import Student from '../models/student.model.js';
import AcademicRecord from '../models/academicRecord.model.js';
import Attendance from '../models/attendance.model.js';

export const createSubject = async (req, res) => {
    try {
        const { name, code, semester, course, department, faculty } = req.body;

        if (!name || !code || !semester || !course || !department) {
            return res.status(400).json({ 
                success: false, 
                message: "Name, code, semester, course, and department are required." 
            });
        }

        const existingSubject = await Subject.findOne({ code });
        if (existingSubject) {
            return res.status(409).json({ 
                success: false, 
                message: "Subject code already exists." 
            });
        }

        const newSubject = await Subject.create({
            name,
            code,
            semester,
            course,
            department,
            faculty
        });

        res.status(201).json({ success: true, message: "Subject created.", subject: newSubject });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllSubjects = async (req, res) => {
    try {
        const { course, department, semester } = req.query;
        const query = {};

        if (course) query.course = course;
        if (department) query.department = department;
        if (semester) query.semester = semester;

        const subjects = await Subject.find(query)
            .populate('course', 'name code')
            .populate('department', 'name code')
            .populate('faculty', 'firstName lastName');

        res.status(200).json({ success: true, subjects });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateSubject = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedSubject = await Subject.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedSubject) {
            return res.status(44).json({ success: false, message: "Subject not found." });
        }

        res.status(200).json({ success: true, message: "Subject updated.", subject: updatedSubject });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;

        const academicCount = await AcademicRecord.countDocuments({ subject: id });
        if (academicCount > 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot delete. Subject is linked to academic records." 
            });
        }

        const attendanceCount = await Attendance.countDocuments({ subject: id });
        if (attendanceCount > 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot delete. Subject is linked to attendance records." 
            });
        }

        const deletedSubject = await Subject.findByIdAndDelete(id);

        if (!deletedSubject) {
            return res.status(404).json({ success: false, message: "Subject not found." });
        }

        res.status(200).json({ success: true, message: "Subject deleted." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};