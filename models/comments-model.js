const db = require("../db/connection");

const selectCommentsByArticleId = (article_id, sort_by, order_by) => {
  let queyStr = "SELECT * FROM comments";
  let queryArg = [];

  if (article_id) {
    queyStr += ` WHERE article_id = $1`;
    queryArg.push(article_id);
  }

  const sort_by_greenListing = ["votes", "created_at"];
  if (sort_by && sort_by_greenListing.includes(sort_by)) {
    queyStr += ` ORDER BY ${sort_by}`;
  }

  const order_by_greenListing = ["ASC", "DESC"];
  if (order_by && order_by_greenListing.includes(order_by.toUpperCase())) {
    queyStr += ` ${order_by.toUpperCase()}`;
  }

  //catch errors
  if (sort_by && !sort_by_greenListing.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (order_by && !order_by_greenListing.includes(order_by.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  return db.query(queyStr, queryArg).then((result) => {
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
    .query("SELECT * FROM comments WHERE article_id=$1", [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }

      return db
        .query(
          "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3)  RETURNING *;",
          [article_id, username, body]
        )
        .then((result) => {
          const comments = result.rows[0];
          return comments;
        });
    });
};

const deleteComment = (comment_id) => {
  console.log(comment_id);

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
