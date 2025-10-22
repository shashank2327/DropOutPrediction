import express from 'express'
import { assignStudentsToUser, createUser, deleteUser, getUserByuserId, getUsersBydept, getUsersByrole, loginUser, removeStudentsFromUser, updateUser } from '../controllers/userController.js'
import { AuthUser } from '../middlewares/auth.js'

const userRouter = express.Router()

userRouter.post('/signup', createUser)
userRouter.post('/login', loginUser)
userRouter.put('/update-profile', AuthUser, updateUser)
userRouter.delete('/delete-profile', AuthUser, deleteUser)


userRouter.get('/by-role', AuthUser, getUsersByrole)
userRouter.get('/by-dept', AuthUser, getUsersBydept)
userRouter.get('/:id', AuthUser, getUserByuserId)

userRouter.put('/assign-students', AuthUser, assignStudentsToUser)
userRouter.put('/remove-students', AuthUser, removeStudentsFromUser)

export default userRouter