import express from 'express';
import {
    addFeeRecord,
    getFeeRecords,
    updateFeeRecord,
    deleteFeeRecord
} from '../controllers/feeController.js';
import { AuthUser } from '../middlewares/auth.js';

const feeRecordRouter = express.Router();

feeRecordRouter.use(AuthUser);

feeRecordRouter.get('/', getFeeRecords);

feeRecordRouter.post('/', addFeeRecord);

feeRecordRouter.put('/:id', updateFeeRecord);

feeRecordRouter.delete('/:id', deleteFeeRecord);

export default feeRecordRouter;