import mongoose, {Schema} from "mongoose"

const departmentModel = new Schema ({
    name: {type: String, required: true, unique: true},
    code: {type: String, required: true, unique: true},
    hod: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, {timestamps: true}) 

const Department = mongoose.model("Department", departmentModel)

export default Department