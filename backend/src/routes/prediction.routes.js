import express from 'express';
import {
    runPrediction,
    getPrediction
} from '../controllers/predictionController.js';
import { AuthUser } from '../middlewares/auth.js';

const predictionRouter = express.Router();

predictionRouter.use(AuthUser);

predictionRouter.post('/run/:studentId', runPrediction);

predictionRouter.get('/:studentId', getPrediction);

export default predictionRouter;