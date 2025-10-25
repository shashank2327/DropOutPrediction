import express from 'express'
import {
    createDept,
    updateDept, 
    deleteDept,
    getallDept
} from '../controllers/departmentController.js'

import { AuthUser } from '../middlewares/auth.js'
const DepartmentRouter = express.Router()

DepartmentRouter.use(AuthUser)

DepartmentRouter.get('/', getallDept);
DepartmentRouter.post('/', createDept)
DepartmentRouter.put('/update/:id', updateDept)
DepartmentRouter.delete('/delete/:id', deleteDept)

export default DepartmentRouter