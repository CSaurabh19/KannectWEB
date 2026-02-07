const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'insecure_dev_secret';

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'missing authorization' });
  const [, token] = header.split(' ');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid token' });
  }
};
