import mongoose, { Mongoose } from "mongoose";
import { Schema } from "mongoose";

// For Teachers, Mentors, Educators

const userModel = new Schema ({

    userId: {type: String, required: true, unique: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    age: {type: Number},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true, minlength: 5},
    phone: {type: Number, unique: true},
    role: {type: String, required: true, default: 'faculty'},
    department: {type: mongoose.Schema.Types.ObjectId, ref: 'Department'},
    assignedStudents: [{type: mongoose.Schema.Types.ObjectId, ref: 'Student'}],
    profile: {
        designation: String,
        qualification: String,
        specialization: String, 
        bio: {type: String, maxlength: 500},
        avatar: String
    }
    
}, {timestamps: true})

const User = mongoose.model("User", userModel);

export default User;