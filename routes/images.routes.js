import express from 'express';
import { upload, uploadSingleImage, deleteSingleImage, deleteAllImagesFromCategory, copyImagesForCategory } from "../controllers/images.controllers.js";

const router = express.Router();

router.post('/addImage/:folder', upload.single('image'), uploadSingleImage);
router.post('/deleteImage', deleteSingleImage);
router.post('/deleteAllImagesFromCategory/:category/:id', deleteAllImagesFromCategory);
router.post('/copyImagesFromCategory/:category/:oldId/:newId', copyImagesForCategory);

export default router;
