const db = require("../db/connection");

const selectAllArticles = () => {
  return db.query("SELECT * FROM articles").then((result) => {
    return result.rows;
  });
};

const selectArticleId = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id=$1", [article_id])
    .then((result) => {
      return result.rows;
    });
};

module.exports = { selectAllArticles, selectArticleId };
