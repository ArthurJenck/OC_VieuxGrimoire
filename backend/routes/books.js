const express = require('express');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const router = express.Router();

const {
  getBooks,
  updateBook,
  addBook,
  deleteBook,
  getOneBook,
  getBestRatings,
} = require('../controllers/books');

router.get('/bestrating', getBestRatings);

router.post('/', auth, multer, addBook);
router.put('/:id', auth, updateBook);
router.delete('/:id', auth, deleteBook);
router.get('/:id', getOneBook);
router.get('/', getBooks);

module.exports = router;
