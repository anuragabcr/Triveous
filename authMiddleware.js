const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access denied. Missing token." });
  }

  try {
    const decoded = jwt.verify(token, "bhjnasjGYGBJBh&^*&^76");

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Invalid token." });
  }
}

module.exports = authMiddleware;
