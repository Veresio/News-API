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

exports.fetchArticles = () => {
  return db
    .query(
      "SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;"
    )
    .then((data) => {
      return data.rows;
    });
};

exports.AddCommentsByArticleID = (id, newComment) => {
  const { body, username } = newComment;
  return db
    .query("SELECT * FROM articles WHERE article_id= $1", [id])
    .then((data) => {
      if (data.rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: "Article does not exist",
        });
      } else {
        return db.query("SELECT * FROM users WHERE username = $1", [username]);
      }
    })
    .then((data) => {
      if (data.rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: "Username does not exist",
        });
      } else if (!body || !username) {
        return Promise.reject({
          status: 400,
          message: "Invalid format",
        });
      } else {
        console.log(body, username, id);
        return db
          .query(
            `INSERT INTO comments 
              (body,author,article_id) 
              VALUES 
              ($1, $2, $3) 
              RETURNING *`,
            [body, username, id]
          )
          .then((comment) => {
            return comment.rows[0];
          });
      }
    });
};
