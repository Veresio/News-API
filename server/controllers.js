const { fetchApi } = require("./models");

exports.getApi = (req, res, next) => {
  data = fetchApi();
  return res.status(200).send({ endpoints: data });
};
