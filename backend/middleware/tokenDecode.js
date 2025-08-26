const userService = require("../service/userService");

async function tokenDecode(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "Authorization header missing" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token missing" });

    const decoded = await userService.verifyToken(token);
    if (!decoded) return res.status(401).json({ error: "Invalid token" });

    req.user = decoded; 
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ error: "Unauthorized" });
  }
}

module.exports = tokenDecode;
