import express from 'express';
import { addTrackingData } from "../controllers/tracking.controller.js";

const router = express.Router();

router.post('/', addTrackingData);

export default router;
