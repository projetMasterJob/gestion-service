const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'rJ6PjfD6vZQZchKZDk6vTLDkOJMuGTY6';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token d\'accès requis' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide ou expiré' });
    }
    
    req.user = user;
    next();
  });
};

const authorizeUser = (req, res, next) => {
  const { id } = req.params;
    
  // Vérifier que l'utilisateur modifie son propre profil
  if (req.user.id !== id) {
    return res.status(403).json({ error: 'Accès non autorisé - vous ne pouvez modifier que votre propre profil.' });
  }
  
  next();
};

module.exports = {
  authenticateToken,
  authorizeUser
}; 