const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (input) => {
  if (input <= 0) {
    return {};
  }
  const result = {};
  input.forEach((article) => {
    result[article.title] = article.article_id;
  });
  return result;
};
