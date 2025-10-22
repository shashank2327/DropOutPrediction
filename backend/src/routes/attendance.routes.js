import express from 'express'
import { AuthUser } from '../middlewares/auth'
import {
    deleteAttendance,
    UpdateAttendance,
    getAttendance,
    addAttendanceRecord
} from '../controllers/attendanceController.js'

const attendanceRouter = express.Router()

attendanceRouter.use(AuthUser)
attendanceRouter.get('/', getAttendance)
attendanceRouter.post('/', addAttendanceRecord)
attendanceRouter.put('/:id', UpdateAttendance)
attendanceRouter.delete('/:id', deleteAttendance)

export default attendanceRouter