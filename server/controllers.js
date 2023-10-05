const {
  fetchTopics,
  fetchApi,
  fetchArticleById,
  AddCommentsByArticleID,
} = require("./models");

exports.getApi = (req, res, next) => {
  data = fetchApi();
  return res.status(200).send({ endpoints: data });
};

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      return res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      return res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;
  AddCommentsByArticleID(article_id, body)
    .then((comment) => {
      return res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
