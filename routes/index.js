import express from 'express';
import { Router } from 'express';
import multer from 'multer';
import { UserController } from '../controllers/index.js';
import { body, checkSchema } from 'express-validator';
import { schemaRegistration, schemaLogin } from '../validations-schemas/index.js';

import { authenticateToken } from '../middlewares/auth.js';

const uploadDestination = 'uploads';
const router = Router();

const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploads = multer({ storage });

router.post('/registration', checkSchema(schemaRegistration), UserController.registration);
router.post('/login', checkSchema(schemaLogin), UserController.login);
router.get('/current', authenticateToken, UserController.current);
router.get('/users/:id', authenticateToken, UserController.getUserByID);
router.put('/users/:id', authenticateToken, UserController.updateUser);

export default router;
