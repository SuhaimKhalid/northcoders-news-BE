const { selectCommentsByArticleId } = require("../models/comments-model");

const getAllCommentOfAticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order_by } = req.query;
  console.log(article_id, sort_by, order_by);
  return selectCommentsByArticleId(article_id, sort_by, order_by)
    .then((result) => {
      res.status(200).send({ comments: result });
    })
    .catch(next);
};

module.exports = { getAllCommentOfAticleId };
