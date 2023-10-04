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
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then((data) => {
      if (data.rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: "Article not found",
        });
      }
      return data.rows[0];
    });
};

exports.fetchCommentsByArticleId = (id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [id]
    )
    .then((data) => {
      if (data.rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: "Article not found",
        });
      }
      return data.rows;
    });
};
