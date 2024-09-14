const express = require('express');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const sharpConfig = require('../middlewares/sharp-config');
const router = express.Router();

const {
  getBooks,
  updateBook,
  addBook,
  deleteBook,
  getOneBook,
  getBestRatings,
  addRating,
} = require('../controllers/books');

router.get('/bestrating', getBestRatings);

router.post('/', auth, multer, sharpConfig, addBook);
router.put('/:id', auth, updateBook);
router.delete('/:id', auth, deleteBook);
router.get('/:id', getOneBook);
router.post('/:id/rating', addRating);
router.get('/', getBooks);

module.exports = router;
