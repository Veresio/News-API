const express = require("express");
const {
  getTopics,
  getApi,
  getArticleById,
  getArticles,
  postCommentsByArticleId,
} = require("./controllers");
const {
  failsafe,
  wrongPath,
  customErrors,
  psqlErrors,
} = require("./errors.controller");
const app = express();

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.post("/api/articles/:article_id/comments", postCommentsByArticleId);

app.use(psqlErrors);

app.use(customErrors);

app.use(failsafe);

app.use(wrongPath);

module.exports = app;
