const { selectTopics } = require("../models/topics-modal");

const getTopics = (req, res, next) => {
  return selectTopics()
    .then((result) => {
      res.status(200).send({ topics: result });
    })
    .catch(next);
};

module.exports = { getTopics };
