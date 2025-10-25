import express from 'express';
import {
    createSubject,
    getAllSubjects,
    updateSubject,
    deleteSubject
} from '../controllers/subject.controller.js';
import { AuthUser } from '../middlewares/auth.js';

const subjectRouter = express.Router();

subjectRouter.use(AuthUser);

subjectRouter.get('/', getAllSubjects);

subjectRouter.post('/', createSubject);

subjectRouter.put('/:id', updateSubject);

subjectRouter.delete('/:id', deleteSubject);

export default subjectRouter;