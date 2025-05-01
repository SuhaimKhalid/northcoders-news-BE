const db = require("../db/connection");

const selectAllArticles = (article_id, sort_by, order, join) => {
  if (join === "false") {
    let queryStr = "SELECT * FROM articles";

    const finalQuery = queriescondition(queryStr, sort_by, order);
    return db.query(finalQuery).then((result) => {
      return result.rows;
    });
  } else {
    let queryStr =
      "SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id";
    let queryArg = [];
    let queryCount = 0;

    if (article_id) {
      queryStr += ` WHERE article_id = $${++queryCount}`;
      queryArg.push(article_id);
    }

    queryStr += " GROUP BY articles.article_id"; // To handle COUNT properly
    const finalQuery = queriescondition(queryStr, sort_by, order);
    return db.query(finalQuery, queryArg).then((result) => {
      return result.rows;
    });
  }
};
function queriescondition(queryStr, sort_by, order) {
  // Make GreenListing
  const greenListing = ["article_id", "created_at", "votes"];
  if (sort_by && greenListing.includes(sort_by)) {
    queryStr += ` ORDER BY ${sort_by}`;
  }

  // Make GreenListing
  const orderList = ["ASC", "DESC"];
  if (order && orderList.includes(order.toUpperCase())) {
    queryStr += ` ${order.toUpperCase()} `;
  }

  if (sort_by && !greenListing.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (order && !orderList.includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return queryStr;
}

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

const updateVotesByArticleId = (article_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request: Missing required fields",
    });
  }

  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [inc_votes, article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return result.rows[0];
    });
};

module.exports = {
  selectAllArticles,
  selectArticleId,
  updateVotesByArticleId,
};
