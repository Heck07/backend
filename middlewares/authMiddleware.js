const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Accès refusé, jeton manquant');

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Jeton invalide');
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
