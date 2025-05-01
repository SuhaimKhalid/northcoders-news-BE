const {
  selectCommentsByArticleId,
  insertNewCommentByArticleId,
} = require("../models/comments-model");

const getAllCommentOfAticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order_by } = req.query;

  return selectCommentsByArticleId(article_id, sort_by, order_by)
    .then((result) => {
      res.status(200).send({ comments: result });
    })
    .catch(next);
};

const postNewCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  return insertNewCommentByArticleId(article_id, username, body)
    .then((result) => {
      res.status(201).send({ comment: result });
    })
    .catch(next);
};

module.exports = { getAllCommentOfAticleId, postNewCommentByArticleId };
