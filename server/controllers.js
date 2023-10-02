const { fetchTopics, fetchApi, fetchArticleById } = require("./models");

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
  const id = req.params;
  console.log(id);
  fetchArticleById(id).then((article) => {
    return res.status(200).send({ article });
  });
};

exports.getArticleById = (req, res, next) => {
  const id = req.params;
  console.log(id);
  fetchArticleById(id).then((article) => {
    return res.status(200).send({ article });
  });
};
