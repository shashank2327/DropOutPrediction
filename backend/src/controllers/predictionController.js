import Student from '../models/student.model.js';
import Attendance from '../models/attendance.model.js';
import AcademicRecord from '../models/academicRecord.model.js';
import FeeRecord from '../models/feeRecord.model.js';
import Prediction from '../models/prediction.model.js';
import Alert from '../models/alert.model.js';
import axios from 'axios';

export const runPrediction = async (req, res) => {
    try {
        const {studentId} = req.params
        const student = await Student.findById(studentId)
        if(!student) {
            return res.status(404).json({success: false, message: "Student not found!"})
        }
        if(!student.mentor) {
            return res.status(400).json({success: false, message: "No mentor assigned to the student. Cannot create alert"})
        }

        const attendance = await Attendance.find({student: studentId})
        const academics = await AcademicRecord.find({student: studentId})
        const fees = await FeeRecord.find({student: studentId})

        // send data of the student to the fastAPI server to generate a prediction from the model
        const aiResponse = await axios.post(process.env.FAST_API_SERVER, {
            attendance,
            academics,
            fees
        })

        const {dropoutRisk, riskLevel, keyFactors} = aiResponse.data

        const prediction = await Prediction.findOneAndUpdate(
            {student: studentId},
            {
                dropoutRisk,
                riskLevel,
                keyFactors,
                predictedAt: Date.now().toLocaleString()
            },
            {new: true, runValidators: true, upsert: true}
        )

        // have to send an alert to the assigned mentor to take action ASAP
        if (riskLevel === 'high') {
            await Alert.create({
                student: studentId,
                assignedTo: student.mentor,
                prediction: prediction._id,
                message: `High dropout risk detected (${dropoutRisk}%) for ${student.firstName}. Key factors: ${keyFactors.join(', ')}`
            });
        }

        res.status(200).json({ success: true, message: "Prediction complete.", prediction });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getPrediction = async(req, res) => {
    try {
        const {studentId} = req.params
        const prediction = await Prediction.findOne({student: studentId}).populate('student', 'firstName lastName')
        if(!prediction) {
            return res.status(404).json({success: false, message: "No prediction on the student yet..."})
        }
        res.status(200).json({success: true, prediction})
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

