const { fetchTopics } = require("./models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      return res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};
