const {
  selectAllArticles,
  selectArticleId,
  updateVotesByArticleId,
} = require("../models/articles-model");

const getAllArticles = (req, res, next) => {
  const { article_id, sort_by, order } = req.query;
  return selectAllArticles(article_id, sort_by, order)
    .then((result) => {
      res.status(200).send({ articles: result });
    })
    .catch(next);
};

const getArticleId = (req, res, next) => {
  const { article_id } = req.params;

  return selectArticleId(article_id)
    .then((result) => {
      res.status(200).send({ article: result });
    })
    .catch(next);
};

const patchVotesByAticleId = (req, res, next) => {
  const { article_id } = req.params;
  return updateVotesByArticleId(article_id)
    .then((result) => {
      res.status(200).send({ article: result });
    })
    .catch(next);
};

module.exports = { getAllArticles, getArticleId, patchVotesByAticleId };
