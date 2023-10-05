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

exports.fetchArticles = () => {
  return db
    .query(
      "SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;"
    )
    .then((data) => {
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
    .query(`SELECT * FROM articles WHERE article_id =$1`, [id])
    .then((article) => {
      if (article.rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: "Article not found",
        });
      } else {
        return db
          .query(
            `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
            [id]
          )
          .then((data) => {
            if (data.rowCount === 0) {
              return Promise.reject({
                status: 404,
                message: "No comments available",
              });
            }
            return data.rows;
          });
      }
    });
};

exports.addCommentsByArticleID = (id, newComment) => {
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

exports.updateArticlesById = (id, voteCount) => {
  const { inc_votes } = voteCount;
  return db
    .query("SELECT * FROM articles WHERE article_id= $1", [id])
    .then((data) => {
      if (data.rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: "Article does not exist",
        });
      } else if (!inc_votes) {
        return Promise.reject({
          status: 400,
          message: "Invalid format",
        });
      } else {
        return db
          .query(
            `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
            [inc_votes, id]
          )
          .then((article) => {
            return article.rows[0];
          });
      }
    });
};

exports.removeCommentsById = (id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [id])
    .then((comment) => {
      if (comment.rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: "Comment does not exist",
        });
      }
    });
};
