import AcademicRecord from '../models/academicRecord.model.js';
import Student from '../models/student.model.js';
import Subject from '../models/subject.model.js';

const setacademicRecord = async (req, res) => {
    try {
      const {studentId, subjectId, semester, marks, grade} = req.body
      if (!studentId || !subjectId || !semester) {
            return res.status(400).json({ success: false, message: "studentId, subjectId, and semester are required." });
      }
      const data = {
        student: studentId,
        subject: subjectId,
        semester: semester,
        marks: marks,
        grade: grade,
        passed: marks >= 30
      }

      const filter = {
          student: studentId,
          subject: subjectId
      }
      const record = await AcademicRecord.findOneAndUpdate(
        filter, 
        data,
        {new: true, runValidators: true, upsert: true}
      )
      res.status(200).json({ success: true, message: "Academic record set successfully.", record });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const getacademicRecords = async (req, res) => {
    try {
        const {subjectId, studentId, semester} = req.query
        const query = {};
        if (subjectId) query.subject = subjectId;
        if (studentId) query.student = studentId;
        if (semester) query.semester = semester;

        const record = await AcademicRecord.find(query)
            .populate('student', 'firstName lastName')
            .populate('subject', 'name code')
            .sort({ semester: 1 });

        res.status(200).json({ success: true, record });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const deleteacademicRecord = async (req, res) => {
    try {
        const {id} = req.params
        const deleterecord = await AcademicRecord.findByIdAndDelete(id)
        if (!deleterecord) {
            return res.status(404).json({ success: false, message: "Academic record not found." })
        }

        res.status(200).json({ success: true, message: "Record deleted." })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export {
    deleteacademicRecord,
    setacademicRecord,
    getacademicRecords
}