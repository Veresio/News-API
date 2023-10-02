const db = require("../db/connection");

exports.fetchApi = () => {
  const endpointsJSON = require("../endpoints.json");
  const endpointsObj = {};
  for (const key in endpointsJSON) {
    const { description, queries, exampleResponse } = endpointsJSON[key];
    endpointsObj[key] = { description, queries, exampleResponse };
  }
  return endpointsObj;
};

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then((data) => {
    return data.rows;
  });
};

exports.fetchArticleById = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1 ", [id])
    .then((data) => {
      return data.rows;
    });
};
