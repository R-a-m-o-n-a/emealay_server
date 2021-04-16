import express from 'express';
import { getSingleSetting, getSettingsOfUser, addSettings, updateSettings, deleteSettings, updateUserContacts, updateUserDarkModePreference, updateUserLanguage, updateSingleUserSetting } from "../controllers/settings.controller.js";

const router = express.Router();

router.get('/:id', getSingleSetting);
router.get('/ofUser/:id', getSettingsOfUser);
router.post('/add', addSettings);
router.post('/edit/:id', updateSettings);
router.post('/delete/:id', deleteSettings);
router.put('/updateUserContacts/:id', updateUserContacts);
router.put('/updateSingleuserSetting/:id', updateSingleUserSetting);
router.put('/updateUserDarkModePreference/:id', updateUserDarkModePreference);
router.put('/updateUserLanguage/:id', updateUserLanguage);

export default router;
