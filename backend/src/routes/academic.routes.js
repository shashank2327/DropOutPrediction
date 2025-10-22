import express from 'express'

import {
    deleteacademicRecord,
    setacademicRecord,
    getacademicRecords
} from '../controllers/academicController.js'

import { AuthUser } from '../middlewares/auth.js'

const academicRouter = express.Router()

academicRouter.use(AuthUser)

academicRouter.get('/', getacademicRecords)
academicRouter.post('/set', setacademicRecord)
academicRouter.delete('/:id', deleteacademicRecord)

export default academicRouter