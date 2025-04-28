const endpoints = require("../endpoints.json");

const getApi = (req, res, next) => {
  return res.status(200).send({ endpoints: endpoints });
};

module.exports = { getApi };
