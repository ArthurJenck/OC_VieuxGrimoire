const express = require('express');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const sharpConfig = require('../middlewares/sharp-config');
const router = express.Router();

// Import des fonctions controllers
const {
  getBooks,
  updateBook,
  addBook,
  deleteBook,
  getOneBook,
  getBestRatings,
  addRating,
} = require('../controllers/books');

// Voir les 3 livres les mieux notés
router.get('/bestrating', getBestRatings);
// Ajouter un nouveau livre - Identification requise, enregistrement de l'image en local et optimisation
router.post('/', auth, multer, sharpConfig, addBook);
// Modifier un livre existant - Identification requise
router.put('/:id', auth, multer, sharpConfig, updateBook);
// Supprimer un livre existant - Identification requise
router.delete('/:id', auth, deleteBook);
// Voir un livre précis
router.get('/:id', getOneBook);
// Ajouter une note à un livre
router.post('/:id/rating', auth, addRating);
// Voir la liste de tous les livres
router.get('/', getBooks);

module.exports = router;
