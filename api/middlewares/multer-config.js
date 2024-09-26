const multer = require('multer');

// Configuration de multer en memoryStorage nécessaire pour fonctionnement du package Sharp et l'optimisation des images
const storage = multer.memoryStorage();

module.exports = multer({ storage }).single('image');
