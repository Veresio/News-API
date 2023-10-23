const express = require("express");
const {
  getTopics,
  getApi,
  getArticleById,
  getArticles,
  getCommentsbyArticleId,
  postCommentsByArticleId,
  patchArticlesById,
  deleteCommentsById,
  getUsers,
} = require("./controllers");

const {
  failsafe,
  wrongPath,
  customErrors,
  psqlErrors,
} = require("./errors.controller");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsbyArticleId);

app.post("/api/articles/:article_id/comments", postCommentsByArticleId);

app.patch("/api/articles/:article_id", patchArticlesById);

app.delete("/api/comments/:comment_id", deleteCommentsById);

app.get("/api/users", getUsers);

app.use(psqlErrors);

app.use(customErrors);

app.use(failsafe);

app.use(wrongPath);

module.exports = app;
