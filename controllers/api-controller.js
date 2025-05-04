const endpoints = require("../endpoints.json");

const dasboard = (req, res, next) => {
  return res.status(200).send({ Dashboard: "Main Screen" });
};

const getApi = (req, res, next) => {
  return res.status(200).send({ endpoints: endpoints });
};

module.exports = { dasboard, getApi };
