// authMiddleware.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).send('Accès refusé, jeton manquant');
  }

  // Vérifie si le format de l'en-tête est "Bearer <token>"
  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(400).send('Format du jeton invalide');
  }

  const token = tokenParts[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send('Jeton invalide');
    }

    req.user = user; // Stocke les informations du token décodé dans la requête
    next();
  });
}

module.exports = authenticateToken;
