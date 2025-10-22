import FeeRecord from '../models/feeRecord.model.js';
import Student from '../models/student.model.js';

export const addFeeRecord = async (req, res) => {
    try {
        const { student, amount, semester, academicYear, paymentDate, transactionId } = req.body
        if (!student || !amount || !semester || !academicYear || !transactionId) {
            return res.status(400).json({ 
                success: false, 
                message: "All details are required." 
            });
        }
        const newRecord = await FeeRecord.create({
            student,
            amount,
            semester,
            academicYear,
            paymentDate,
            transactionId
        });

        res.status(201).json({ success: true, message: "Fee record created.", record: newRecord });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getFeeRecords = async (req, res) => {
    try {
        const { student, semester, academicYear } = req.query;
        
        const query = {};
        if (student) query.student = student;
        if (semester) query.semester = semester;
        if (academicYear) query.academicYear = academicYear;

        const records = await FeeRecord.find(query)
            .populate('student', 'firstName lastName')
            .sort({ paymentDate: -1 });

        res.status(200).json({ success: true, records });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateFeeRecord = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedRecord = await FeeRecord.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedRecord) {
            return res.status(404).json({ success: false, message: "Fee record not found." });
        }

        res.status(200).json({ success: true, message: "Record updated.", record: updatedRecord });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteFeeRecord = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRecord = await FeeRecord.findByIdAndDelete(id);

        if (!deletedRecord) {
            return res.status(404).json({ success: false, message: "Fee record not found." });
        }
        res.status(200).json({ success: true, message: "Record deleted." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export {
    deleteFeeRecord,
    addFeeRecord,
    updateFeeRecord,
    getFeeRecords
}