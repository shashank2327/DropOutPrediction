import express from 'express';
import {
    markAlertRead,
    deleteAlert
} from '../controllers/alertController.js';
import { AuthUser } from '../middlewares/auth.js';

const alertRouter = express.Router();

alertRouter.use(AuthUser);

alertRouter.put('/:id/read', markAlertRead);

alertRouter.delete('/:id', deleteAlert);

export default alertRouter;