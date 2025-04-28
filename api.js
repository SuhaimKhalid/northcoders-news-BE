const express = require("express");
const app = express();

const { getApi } = require("./controllers/api-controller");

const { getTopics } = require("./controllers/topics-controller");

/** Task 1 */
app.get("/api", getApi);

/** Task 2 */
app.get("/api/topics", getTopics);

// app.use((err, req, res, next) => {
//   console.log(err);
// });

// 404 handler - This must be after all routes
app.all("/*slpat", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

// 500 Error Status
app.use((err, req, res, next) => {
  console.log(err, "<--- 500 Status Error");
  res.status(500).send({ msg: "Internal Server Error" });
});
module.exports = app;
