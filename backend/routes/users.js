const express = require('express');
const router = express.Router();

const { signup, login } = require('../controllers/users');

// Connecter un utilisateur
router.post('/signup', signup);
// Ajouter un nouvel utilisateur
router.post('/login', login);

module.exports = router;
