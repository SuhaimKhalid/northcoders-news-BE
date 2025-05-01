const { selectUsers } = require("../models/users-model");

const getUsers = (req, res, next) => {
  return selectUsers().then((result) => {
    res.status(200).send({ users: result });
  });
};

module.exports = { getUsers };
