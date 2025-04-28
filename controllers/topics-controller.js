const { selectTopics } = require("../models/topics-model");

const getTopics = (req, res, next) => {
  return selectTopics()
    .then((result) => {
      res.status(200).send({ topics: result });
    })
    .catch(next);
};

module.exports = { getTopics };
