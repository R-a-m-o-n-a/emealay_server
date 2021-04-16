import express from 'express';
import { getAllUsers, getUsersFromQuery, getUserById, updateUserMetadata, updateUser } from "../controllers/users.controller.js";

const router = express.Router();

router.get('/fromQuery/:query', getUsersFromQuery);
router.get('/all', getAllUsers);
router.get('/byId/:id', getUserById);
router.put('/updateMetadata/:id', updateUserMetadata);
router.put('/update/:id', updateUser);
export default router;
