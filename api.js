const express = require("express");
const app = express();
const cors = require("cors");
const { dasboard, getApi } = require("./controllers/api-controller");
app.use(cors());
const { getTopics } = require("./controllers/topics-controller");

const {
  getAllCommentOfAticleId,
  postNewCommentByArticleId,
  deleteCommentById,
} = require("./controllers/comments-controller");

const {
  getArticleId,
  patchVotesByAticleId,
  getAllArticles,
} = require("./controllers/articles-controller");

const { getUsers } = require("./controllers/users-controller");
app.use(express.json());

app.get("/", dasboard);

/** Task 1 */
app.get("/api", getApi);

/** Task 2 */
app.get("/api/topics", getTopics);

// /** Custom to get by article title**/
// app.get("/api/articles/title/:title", getArticleTitle);

/** Task 3 & 12*/
app.get("/api/articles/:article_id", getArticleId);

/** Task 4 & 10 & 11*/
app.get("/api/articles", getAllArticles);

/** Task 5 */
app.get("/api/articles/:article_id/comments", getAllCommentOfAticleId);

/** Task 6 */
app.post("/api/articles/:article_id/comments", postNewCommentByArticleId);

/** Task 7 */
app.patch("/api/articles/:article_id", patchVotesByAticleId);

/** Task 8 */
app.delete("/api/comments/:comment_id", deleteCommentById);

/** Task 9 */
app.get("/api/users", getUsers);

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
  res.status(500).send({ msg: "Internal Server Error !" });
});
module.exports = app;
