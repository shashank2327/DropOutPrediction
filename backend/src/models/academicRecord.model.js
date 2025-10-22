import mongoose, { Schema } from "mongoose"

const AcademicModel = new Schema ({
    student: {type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true},
    subject: {type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true},
    semester: {type: Number, required: true},
    marks: {type: Number, required: true},
    grade: {type: String, required: true},
    passed: {type: Boolean, required: true},
    academicYear: {type: Number, required: true}
}, {timestamps: true})

const AcademicRecord = mongoose.model("AcademicRecord", AcademicModel)

export default AcademicRecord