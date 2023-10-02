const express = require("express");
const { getTopics, getApi } = require("./controllers");
const { failsafe, wrongPath } = require("./errors.controller");
const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.use(failsafe);

app.use(wrongPath);

module.exports = app;
