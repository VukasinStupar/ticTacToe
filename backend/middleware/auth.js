const userService = require('../service/userService'); 

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    const decoded = userService.verifyToken(token); 
    req.user = decoded; 
    
    next();
  } catch (error) {
    // Ovde bi 401 bio precizniji response, 403 se uglavnom vraca kada korisnik ima validan token i uspesno je autentifikovan ali nema dovoljan nivo autorizacije za pristup datom resursu.
    // To moze biti neodgovarajuca rola ili pokusaj pristupa privatnom resursu koji je kreiran od strane drugog korisnika.
    // Generalno u middlewareu bi mogao da proveravas rolu korisnika i za takve slucajeve odmah vratis 403, a za drugi slucaj bi proveru uglavnom radio u servisnom sloju.
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = authenticateToken;
