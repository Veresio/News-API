const express = require("express");
const { getTopics, getApi, getArticleById } = require("./controllers");
const {
  failsafe,
  wrongPath,
  customErrors,
  psqlErrors,
} = require("./errors.controller");
const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use(psqlErrors);

app.use(customErrors);

app.use(failsafe);

app.use(wrongPath);

module.exports = app;
