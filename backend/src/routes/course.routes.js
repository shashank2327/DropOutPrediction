import express from 'express';
import {
    createCourse,
    getAllCourses,
    updateCourse,
    deleteCourse
} from '../controllers/courseController.js';
import { AuthUser } from '../middlewares/auth.js';

const courseRouter = express.Router();

courseRouter.use(AuthUser);

courseRouter.get('/', getAllCourses);

courseRouter.post('/', createCourse);

courseRouter.put('/:id', updateCourse);

courseRouter.delete('/:id', deleteCourse);

export default courseRouter;