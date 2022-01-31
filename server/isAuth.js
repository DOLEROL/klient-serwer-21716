const jwt = require("jsonwebtoken");

module.exports = ({ req }) => {
  const token = req.headers["authorization"];
  if (!token) {
    throw new Error("Not authenticated");
  }

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("TOKEN_EXPIRED");
  }
  return { id: payload.id };
};
