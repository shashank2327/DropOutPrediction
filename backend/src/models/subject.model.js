import mongoose, { Schema } from "mongoose"

const SubjectModel = new Schema ({
    name: {type: String, required: true},
    code: {type: String, required: true, unique: true},
    semester: {type: Number, required: true},
    course: {type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true},
    department: {type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true},
    faculty: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},

}, {timestamps: true})

const Subject = mongoose.model("Subject", SubjectModel)

export default Subject