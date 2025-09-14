const db = require("../connection");
const format = require("pg-format");

const { convertTimestampToDate, createRef } = require("./utils.js");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics`);
    }) /** Creation of Table start from here */
    .then(() => {
      return db.query(`
  CREATE TABLE topics(
  slug VARCHAR(299) PRIMARY KEY,
  description VARCHAR(300) NOT NULL,
  img_url VARCHAR(1000));
  `);
    })
    .then(() => {
      return db.query(`
          CREATE TABLE users (
          username VARCHAR(500) PRIMARY KEY,
          name VARCHAR(200) NOT NULL,
          avatar_url VARCHAR(1000)
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE articles (
          article_id SERIAL PRIMARY KEY,
          title VARCHAR(500) NOT NULL,
          topic VARCHAR(1000) REFERENCES topics(slug),
          author VARCHAR(500) REFERENCES users(username),
          body TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          votes INT DEFAULT 0,
          article_img_url VARCHAR(1000)
        );
        `);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments(
          comment_id SERIAL PRIMARY KEY,
          article_id INT REFERENCES articles(article_id),
          body TEXT NOT NULL,
          votes INT DEFAULT 0,
          author VARCHAR(500) REFERENCES users(username),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`);
    }) /** insertaion of Table start from here */
    .then(() => {
      const formatedTableTopic = topicData.map((obj) => {
        return [obj.slug, obj.description, obj.img_url];
      });
      const insertTopicTable = format(
        `INSERT INTO topics (slug, description,img_url) VALUES %L`,
        formatedTableTopic
      );
      return db.query(insertTopicTable);
    })
    .then(() => {
      const formatedUserTable = userData.map((obj) => {
        return [obj.username, obj.name, obj.avatar_url];
      });
      const inseretedUser = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L`,
        formatedUserTable
      );
      return db.query(inseretedUser);
    })
    .then(() => {
      const formatedArticelTale = articleData.map((obj) => {
        return [
          obj.title,
          obj.topic,
          obj.author,
          obj.body,
          new Date(obj.created_at).toISOString(),
          obj.votes,
          obj.article_img_url,
        ];
      });
      const insertArticleData = format(
        `
        INSERT INTO articles (title,topic,author,body,created_at,votes,article_img_url) VALUES %L RETURNING *`,
        formatedArticelTale
      );
      return db.query(insertArticleData);
    })
    .then((result) => {
      const articleReferenceObject = createRef(result.rows);

      const formatedCommentsTable = commentData.map((obj) => {
        const convertTimeStamp = convertTimestampToDate(obj);
        return [
          articleReferenceObject[obj.article_title],
          convertTimeStamp.body,
          convertTimeStamp.votes,
          convertTimeStamp.author,
          convertTimeStamp.created_at,
        ];
      });
      const InsertedCommentsTable = format(
        `INSERT INTO comments (article_id,body,votes,author,created_at) VALUES %L RETURNING *`,
        formatedCommentsTable
      );

      return db.query(InsertedCommentsTable);
    });
  // .then((result) => {
  //   console.log(result.rows, "seeds");
  // });
};
module.exports = seed;
