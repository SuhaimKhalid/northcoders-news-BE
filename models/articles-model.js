const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");

const selectAllArticles = (article_id, sort_by, order, topic) => {
  let queryStr = `SELECT 
      articles.article_id,
      articles.author,
      articles.title,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id`;
  // if (topic) {
  //   queryStr = "SELECT * FROM articles";
  // } else {
  //   queryStr = `SELECT
  //    articles.article_id,
  //   articles.author,
  //   articles.title,
  //   articles.topic,
  //   articles.created_at,
  //   articles.votes,
  //   articles.article_img_url,
  //   COUNT (comments.comment_id)::INT as comment_count FROM articles
  //     LEFT JOIN comments ON articles.article_id = comments.article_id
  //     GROUP BY articles.author,
  // articles.title,
  // articles.article_id,
  // articles.topic,
  // articles.created_at,
  // articles.votes,
  // articles.article_img_url`;
  // }
  const finalQuery = queriescondition(queryStr, sort_by, order, topic);

  console.log(finalQuery);
  return db.query(finalQuery).then((result) => {
    console.log(result);
    return result.rows;
  });
};
function queriescondition(queryStr, sort_by, order, topic) {
  // For to add conditon in query for topics
  const topicGreenListing = ["mitch", "cats", "cooking", "coding", "football"];
  // if (topic && topicGreenListing.includes(topic.toLowerCase())) {
  //   queryStr += ` WHERE topic = '${topic.toLowerCase()}';`;
  // }
  if (topic && topicGreenListing.includes(topic.toLowerCase())) {
    queryStr += ` WHERE articles.topic = '${topic.toLowerCase()}'`;
  } else if (topic && !topicGreenListing.includes(topic.toLowerCase())) {
    throw { status: 400, msg: "Bad Request: Topic does not exist" };
  }
  queryStr += ` GROUP BY articles.article_id`;

  // add order query to main query if ave any sorted column
  const greenListing = ["created_at", "votes", "comment_count"];
  if (sort_by && greenListing.includes(sort_by)) {
    queryStr += ` ORDER BY ${sort_by}`;
  } else if (sort_by) {
    throw { status: 400, msg: "Bad Request: Invalid sort_by column" };
  }

  // Add Method of order
  const orderList = ["ASC", "DESC"];
  if (order && orderList.includes(order.toUpperCase())) {
    queryStr += ` ${order.toUpperCase()}`;
  } else if (order) {
    throw { status: 400, msg: "Bad Request: Invalid order" };
  }

  return queryStr + ";";
}

const selectArticleId = (article_id, countAllComment) => {
  let queryStr = "";
  if (countAllComment) {
    queryStr = `SELECT 
        articles.*,
        COUNT(comments.comment_id)::INT AS comment_count
      FROM 
        articles
      LEFT JOIN 
        comments ON articles.article_id = comments.article_id
      WHERE 
        articles.article_id = $1
      GROUP BY 
        articles.article_id;`;
  } else {
    queryStr = "SELECT * FROM articles WHERE article_id=$1";
  }
  return db.query(queryStr, [article_id]).then((result) => {
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
// const selecttArticleByTitle = (title) => {
//   let queryStr = "SELECT * FROM articles WHERE title=$1";

//   return db.query(queryStr, [title]).then((result) => {
//     if (result.rows.length === 0) {
//       return Promise.reject({ status: 404, msg: "Not Found" });
//     } else {
//       console.log(result);
//       return result.rows[0];
//     }
//   });
// };
module.exports = {
  selectAllArticles,
  selectArticleId,
  updateVotesByArticleId,
};
