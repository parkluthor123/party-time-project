import express from 'express';
const router = express.Router();
import UserController from '../controllers/UserController';
import PartyController from '../controllers/PartyController';
import { diskStorage } from '../helpers/Helper';
import multer from 'multer';
import Auth from '../middleware/auth';

const upload = multer({ storage: diskStorage });

// Rotas de usuário
router.get('/user/:id', Auth.checkToken, UserController.getUser)

router.put('/user', Auth.checkToken, UserController.updateUser)

// Rotas de festa
router.get('/party/user/:id', Auth.checkToken, PartyController.getUserParty)

router.get('/party/user', Auth.checkToken, PartyController.getUserParties)

router.post('/party', Auth.checkToken, upload.fields([{name: 'photos'}]), PartyController.createParty)

router.patch('/party/update', Auth.checkToken, upload.fields([{name: 'photos'}]), PartyController.updateParty)

router.delete('/party', Auth.checkToken, PartyController.deleteParty)

export default router;