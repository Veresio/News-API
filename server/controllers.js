const {
  fetchTopics,
  fetchApi,
  fetchArticleById,
  fetchCommentsByArticleId,
  addCommentsByArticleID,
  fetchArticles,
  updateArticlesById,
  removeCommentsById,
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

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      return res.status(200).send({ articles });
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

exports.getCommentsbyArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      return res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;
  addCommentsByArticleID(article_id, body)
    .then((comment) => {
      return res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;
  updateArticlesById(article_id, body)
    .then((article) => {
      return res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentsById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentsById(comment_id)
    .then(() => {
      return res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};
