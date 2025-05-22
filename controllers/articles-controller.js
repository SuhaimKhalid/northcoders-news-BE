const {
  selectAllArticles,
  selectArticleId,
  updateVotesByArticleId,
  selecttArticleByTitle,
} = require("../models/articles-model");

const getAllArticles = (req, res, next) => {
  const { article_id, sort_by, order, topic, title } = req.query;

  return selectAllArticles(article_id, sort_by, order, topic, title)
    .then((result) => {
      res.status(200).send({ articles: result });
    })
    .catch(next);
};

const getArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { countAllComments } = req.query;

  return selectArticleId(article_id, countAllComments)
    .then((result) => {
      res.status(200).send({ article: result });
    })
    .catch(next);
};

const patchVotesByAticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  return updateVotesByArticleId(article_id, inc_votes)
    .then((result) => {
      res.status(200).send({ article: result });
    })
    .catch(next);
};

// const getArticleTitle = (req, res, next) => {
//   const { title } = req.params;

//   return selecttArticleByTitle(title)
//     .then((result) => {
//       res.status(200).send({ article: result });
//     })
//     .catch(next);
// };

module.exports = {
  getAllArticles,
  getArticleId,
  patchVotesByAticleId,
};
