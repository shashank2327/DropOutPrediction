import mongoose from "mongoose"
import { Schema } from "mongoose"

//user
//student
//attendancerecord
//academicrecord
//feerecord
//department
//course
//prediction
//alert
//notification

const StudentModel = new Schema ({
    
    studentId: {type: String, required: true, unique: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    age: {type: Number},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true},
    phone: {type: Number, unique: true},

    department: {type: mongoose.Schema.Types.ObjectId, ref: 'Department'},
    course: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
    batch: {type: Number},
    currentSem: {type: Number, default: 1},
    
    mentor: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    academicRecords: [{type: mongoose.Schema.Types.ObjectId, ref: 'AcademicRecord'}],
    feeRecords: [{type: mongoose.Schema.Types.ObjectId, ref: 'FeeRecord'}],

    profile: {
        bio: {type: String, maxlength: 500},
        avatar: String
    }
}, {timestamps: true})

const Student = mongoose.model("Student", StudentModel)

export default Student