const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Récupération du jeton d'authentification en enlevant le préfixe Bearer
    const token = req.headers.authorization.split(' ')[1];
    // Vérification du jeton avec la clef de cryptage
    const decodedToken = jwt.verify(
      token,
      'cleEncryptageSuperSecretevtvrasjcxuwihvezjpsijdzhodiuzchzou'
    );
    const userId = decodedToken.userId;
    // Remplacement du userId par une valeur cryptée pour confidentialité
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
