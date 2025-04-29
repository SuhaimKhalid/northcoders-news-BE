const {
  selectAllArticles,
  selectArticleId,
} = require("../models/articles-model");

const getAllArticles = (req, res, next) => {
  const { article_id, sort_by, order } = req.query;
  console.log(sort_by, order);
  return selectAllArticles(article_id, sort_by, order)
    .then((result) => {
      console.log(result);
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

module.exports = { getAllArticles, getArticleId };
