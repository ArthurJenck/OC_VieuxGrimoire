const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Connecter un utilisateur
exports.signup = (req, res, next) => {
  // Hashage du mot de passe avec le package bcrypt
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // Ajout du nouvel utilisateur avec le mot de passe hashé
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      // Enregistrement du nouvel utilisateur
      user
        .save()
        .then(() => res.status(201).json({ message: 'Utilisateur enregistré' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Ajouter un nouvel utilisateur
exports.login = (req, res, next) => {
  // Déclaration d'un message d'erreur générique et vague pour ne pas donner d'informations confidentielles
  const errorMsg = 'Adresse-mail / Mot de passe incorrect';
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (user === null) {
        res.status(401).json({ message: errorMsg });
      } else {
        // Vérification du hashage du mot de passe
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res.status(401).json({ message: errorMsg });
            } else {
              res.status(200).json({
                userId: user._id,
                // Génération du jeton d'authentification valable une semine à l'aide d'une clef de cryptage
                token: jwt.sign(
                  {
                    userId: user._id,
                  },
                  'cleEncryptageSuperSecretevtvrasjcxuwihvezjpsijdzhodiuzchzou',
                  { expiresIn: '7d' }
                ),
              });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
