const jwt = require("jsonwebtoken");
require("dotenv").config();

const authmiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Extract token from header
    const token = header.split(" ")[1];

    // Verify token using the correct secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach userId to request
    req.user = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authmiddleware;