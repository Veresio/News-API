const { fetchTopics, fetchApi } = require("./models");

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
