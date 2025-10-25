import Student from '../models/student.model.js';
import Attendance from '../models/attendance.model.js';
import AcademicRecord from '../models/academicRecord.model.js';
import FeeRecord from '../models/feeRecord.model.js';
import Prediction from '../models/prediction.model.js';
import Alert from '../models/alert.model.js';

export const markAlertRead = async (req, res) => {
   try {
        const {id} = req.params
        const facultyId = req.user._id
        const updatedAlert = await Alert.findOneAndUpdate(
            {_id: id, assignedTo: facultyId},
            {isRead: true},
            {new: true}
        )
        if(!updatedAlert) {
            return res.status(404).json({success: false, message: "No alert found"})
        }
        res.status(200).json({success: true, alert: updatedAlert})
   } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
   }
}

export const deleteAlert = async (req, res) => {
    try {
        const {id} = req.params
        const facultyId = req.user._id
        const deletedAlert = await Alert.findOneAndDelete({_id: id, assignedTo: facultyId})
        if (!deletedAlert) {
            return res.status(404).json({ 
                success: false, 
                message: "Alert not found or not assigned to you." 
            });
        }

        res.status(200).json({ success: true, message: "Alert deleted." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

