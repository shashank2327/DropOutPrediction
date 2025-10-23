import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import 'dotenv/config'
import connectDB from "./src/lib/db.js"
import cors from 'cors'
import userRouter from "./src/routes/user.routes.js"
import studentRouter from "./src/routes/student.routes.js"
import attendanceRouter from "./src/routes/attendance.routes.js"
import academicRouter from "./src/routes/academic.routes.js"
import feeRecordRouter from "./src/routes/fee.routes.js"

const app = express();
connectDB()

const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors({credentials: true}))
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))

app.use('/api/users', userRouter)
app.use('/api/students', studentRouter)

app.use('/api/attendance', attendanceRouter)
app.use('/api/academics', academicRouter)
app.use('/api/fees', feeRecordRouter)



app.get('/', (req, res) => {
    res.send("API WORKING").status(200)
})

app.listen(port, (req, res)=> {
    console.log(`Server started on PORT ${port}`)
}) 