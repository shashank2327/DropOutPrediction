import express from 'express'
import { 
    registerStudent, 
    loginStudent,
    updateStudentProfile,
    getMyAttendance,
    getMyAcademicRecords,
    getMyFeeRecords,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    getmyprofile
} from '../controllers/studentController.js'

import { AuthUser } from '../middlewares/auth.js'
import { AuthStudent } from '../middlewares/auth.student.js'

const studentRouter = express.Router()

//Student
studentRouter.post('/signup', registerStudent)
studentRouter.post('/login', loginStudent)
studentRouter.put('/update-profile', AuthStudent, updateStudentProfile)
studentRouter.get('/my-attendance', AuthStudent, getMyAttendance)
studentRouter.get('/my-academics', AuthStudent, getMyAcademicRecords)
studentRouter.get('/my-fees', AuthStudent, getMyFeeRecords)
studentRouter.get('/profile', AuthStudent, getmyprofile)
//Admin
studentRouter.get('/', AuthUser, getAllStudents)
studentRouter.get('/get-student/:id', AuthUser, getStudentById)
studentRouter.put('/update-student/:id', AuthUser, updateStudent)
studentRouter.delete('/delete-student/:id', AuthUser, deleteStudent)

export default studentRouter