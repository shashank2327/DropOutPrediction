import mongoose, { Schema } from "mongoose"

const predictionModel = new Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
        unique: true 
    },
    dropoutRisk: {
        type: Number,
        required: true 
    },
    riskLevel: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high']
    },
    keyFactors: [{
        type: String
    }],
    predictedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const Prediction = mongoose.model("Prediction", predictionModel)

export default Prediction;