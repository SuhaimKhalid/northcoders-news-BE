const db = require("../db/connection");

const selectCommentsByArticleId = (article_id, sort_by, order) => {
  const sort_by_greenListing = ["votes", "created_at"];
  const order_greenListing = ["ASC", "DESC"];
  //catch errors
  if (sort_by && !sort_by_greenListing.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (order && !order_greenListing.includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  let queryStr = `SELECT 
comment_id,
votes,
created_at,
author,
body,
article_id
 FROM comments WHERE article_id = $1`;

  if (sort_by && sort_by_greenListing.includes(sort_by)) {
    queryStr += ` ORDER BY ${sort_by}`;
  }

  if (order && order_greenListing.includes(order.toUpperCase())) {
    queryStr += ` ${order.toUpperCase()}`;
  }

  return db.query(queryStr, [article_id]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    } else {
      return result.rows;
    }
  });
};

const insertNewCommentByArticleId = (article_id, username, body) => {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request: Missing required fields",
    });
  }
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }

      return db
        .query(
          `INSERT INTO comments (article_id, author, body)
           VALUES ($1, $2, $3)
           RETURNING comment_id, article_id, author, body, votes, created_at;`,
          [article_id, username, body]
        )
        .then((result) => {
          return result.rows[0];
        });
    });
};

const deleteComment = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
      comment_id,
    ])
    .then((result) => {
      return result.rowCount;
    });
};
module.exports = {
  selectCommentsByArticleId,
  insertNewCommentByArticleId,
  deleteComment,
};
