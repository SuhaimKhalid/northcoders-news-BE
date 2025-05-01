const {
  selectCommentsByArticleId,
  insertNewCommentByArticleId,
  deleteComment,
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
const deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  return deleteComment(comment_id)
    .then((result) => {
      console.log(result, "controler");
      if (result === 0) {
        // No rows deleted means comment_id did not exist
        return next({ status: 404, msg: "Comment not found" });
      } else {
        // Successful deletion
        res.status(204).send();
      }
    })
    .catch(next);
};

module.exports = {
  getAllCommentOfAticleId,
  postNewCommentByArticleId,
  deleteCommentById,
};
