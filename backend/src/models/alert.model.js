import mongoose, { Schema } from "mongoose"

const alertModel = new Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    prediction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prediction',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Alert = mongoose.model("Alert", alertModel)

export default Alert;