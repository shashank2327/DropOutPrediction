import mongoose, { Schema } from "mongoose"

const CourseModel = new Schema ({
    name: {type: String, required: true},
    specialization: {type: String, required: true},
    code: {type: String, required: true},
    duration: {type: Number, required: true},
    department: {type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true},

}, {timestamps: true})

const Course = mongoose.model("Course", CourseModel)

export default Course