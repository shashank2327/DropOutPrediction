import mongoose, {Schema} from  'mongoose'

const FeeModel = new Schema ({
    student: {type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true},
    amount: {type: Number, required: true},
    semester: {type: Number, required: true},
    academicYear: {type: Number, required: true},
    paymentDate: { type: Date },
    transactionId: {type: String, required: true}
}, {timestamps: true})

const FeeRecord = mongoose.model("FeeRecord", FeeModel)

export default FeeRecord

