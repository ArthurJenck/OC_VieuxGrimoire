const fs = require('fs');
const sharp = require('sharp');

module.exports = async (req, res, next) => {
  fs.access('./images', (error) => {
    if (error) {
      fs.mkdirSync('./images');
    }
  });
  const { originalname } = req.file;
  const name = originalname.split(' ').join('_');
  const timestamp = Date.now();
  const ref = `${name}-${timestamp}.webp`;

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
