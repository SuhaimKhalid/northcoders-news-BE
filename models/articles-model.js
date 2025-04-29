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
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return result.rows[0];
      }
    });
};

module.exports = { selectAllArticles, selectArticleId };
