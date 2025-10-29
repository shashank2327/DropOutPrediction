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

import departmentRouter from './src/routes/department.routes.js';
import courseRouter from './src/routes/course.routes.js';
import subjectRouter from './src/routes/subject.routes.js';
import predictionRouter from './src/routes/prediction.routes.js';
import alertRouter from './src/routes/alert.routes.js';

const app = express();
connectDB()

const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors({credentials: true}))
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))

app.use('/api/user', userRouter)
app.use('/api/student', studentRouter)

app.use('/api/attendance', attendanceRouter)
app.use('/api/academics', academicRouter)
app.use('/api/fees', feeRecordRouter)

app.use('/api/departments', departmentRouter);
app.use('/api/courses', courseRouter);
app.use('/api/subjects', subjectRouter);
app.use('/api/predict', predictionRouter);
app.use('/api/alerts', alertRouter);

app.get('/', (req, res) => {
    res.send("API WORKING").status(200)
})

app.listen(port, (req, res)=> {
    console.log(`Server started on PORT ${port}`)
}) 