const jwt = require("jsonwebtoken");

const createAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

const createRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET_REFRESH, {
    expiresIn: "7d",
  });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
};
