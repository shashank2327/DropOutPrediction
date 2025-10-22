import mongoose, { Schema } from "mongoose"

const AttendanceModel = new Schema ({
    
    student: {type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true},
    subject: {type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true},
    date: {type: Date, required: true},
    status: {type: String, enum: ["present", "absent", "leave"], required: true},
    markedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}

}, {timestamps: true})

const Attendance = mongoose.model("Attendance", AttendanceModel)

export default Attendance