import express from 'express'
import { createUser, deleteUser, getMyAssignedStudents, getUserByuserId, getUsersBydept, getUsersByrole, loginUser, updateUser, getmyAlerts, getmyprofile } from '../controllers/userController.js'
import { AuthUser } from '../middlewares/auth.js'

const userRouter = express.Router()

userRouter.post('/signup', createUser)
userRouter.post('/login', loginUser)
userRouter.put('/update-profile', AuthUser, updateUser)
userRouter.delete('/delete-profile', AuthUser, deleteUser)
userRouter.get('/profile', AuthUser, getmyprofile)

userRouter.get('/by-role', AuthUser, getUsersByrole)
userRouter.get('/by-dept', AuthUser, getUsersBydept)
userRouter.get('/assigned-students', AuthUser, getMyAssignedStudents)
userRouter.get('/alerts', AuthUser, getmyAlerts)
userRouter.get('/:id', AuthUser, getUserByuserId)


export default userRouter