const jwt = require('jsonwebtoken');
// servis nikada ne bi trebao da bude 'svestan' middleware-a, ukoliko oba koristi isti tip/funkciju (kao sto je tip errora u ovom slucaju) onda zajednicki kod treba staviti u neki pomocni fajl i export-ovati odatle
// Generalno route fajl sme da importuje kontrolere i middleware, middleware moze importovati neke pomocne servis/util fajlove, kontroler importuje servis i servis repozitorijum
// Ovaj redosled postoji kako bi se lakse napravila jasna podela poslova izmedju svakog sloja, kao i izbegli ciklicni importi u aplikaciju koji mogu izazvati infinite loop i nemogucnost aplikacije da se podigne
const AuthenticationError = require('../middleware/errorMiddleware');

// Cesto je praksa ucitati sve env varijable u jednom config fajlu i onda ih eksportovati u vidu js objekta odatle i kao takav koristiti u ostatku aplikacije
const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your_jwt_secret',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
};

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username
    },
    JWT_CONFIG.secret,
    { expiresIn: JWT_CONFIG.expiresIn }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_CONFIG.secret);
  } catch (error) {
    throw new AuthenticationError('Invalid or expired token');
  }
};

module.exports = {
  generateToken,
  verifyToken,
}