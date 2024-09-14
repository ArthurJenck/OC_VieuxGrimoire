const fs = require('fs');
const sharp = require('sharp');

module.exports = async (req, res, next) => {
  // Vérification qu'un dossier images existe déjà, sinon il sera créé
  fs.access('./images', (error) => {
    if (error) {
      fs.mkdirSync('./images');
    }
  });
  // Génération d'un nom unique à chaque image
  const { originalname } = req.file;
  const name = originalname.split(' ').join('_');
  const timestamp = Date.now();
  const ref = `${name}-${timestamp}.webp`;

  // Réduction des images et conversion au format webp
  await sharp(req.file.buffer)
    .resize({
      fit: sharp.fit.contain,
      height: 400,
    })
    .webp({ quality: 20 })
    .toFile('./images/' + ref);
  req.file.filename = ref;
  next();
};
