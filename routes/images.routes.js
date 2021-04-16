import express from 'express';
import { upload, uploadSingleImage, deleteSingleImage, deleteAllImagesFromCategory } from "../controllers/images.controllers.js";

const router = express.Router();

router.post('/addImage/:folder', upload.single('image'), uploadSingleImage);
router.post('/deleteImage/:folder/:id', upload.single('image'), deleteSingleImage);
router.post('/deleteAllImagesFromCategory/:category/:id', upload.single('image'), deleteAllImagesFromCategory);

export default router;
