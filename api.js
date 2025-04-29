const express = require("express");
const app = express();

const { getApi } = require("./controllers/api-controller");

const { getTopics } = require("./controllers/topics-controller");

const {
  getAllArticles,
  getArticleId,
} = require("./controllers/articles-controller");

/** Task 1 */
app.get("/api", getApi);

/** Task 2 */
app.get("/api/topics", getTopics);

/** Task 3 */
app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleId);

// 400 handler - Handle invalid User Type
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});
// 404 handler - Handle invalid ID
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

// 404 handler - This must be after all routes
app.all("/*slpat", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
  next(err);
});

// 500 Error Status
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});
module.exports = app;
