const express = require("express");
const { getApi } = require("./controllers");
const { failsafe } = require("./errors.controller");
const app = express();

app.get("/api", getApi);

app.use(failsafe);
module.exports = app;
