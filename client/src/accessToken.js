let token = "";

const setAccessToken = (s) => {
  token = s;
};

const getAccessToken = () => {
  return token;
};

module.exports = {
  setAccessToken,
  getAccessToken,
};
