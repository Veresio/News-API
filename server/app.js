const express = require("express");
const { getTopics, getApi } = require("./controllers");
const { failsafe } = require("./errors.controller");
const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.use(failsafe);

module.exports = app;
