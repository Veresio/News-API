exports.customErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ message: err.message });
  else next(err);
};
exports.failsafe = (err, req, res, next) => {
  console.log(err); // troubleshooting unexpected errors and oversights
  res.status(500).send("internal server error");
};

exports.wrongPath = (req, res, next) => {
  res.status(404).send({ message: "Path not found" });
};

exports.psqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Invalid data type" });
  } else if (err.code) {
    console.log(err.code);
    res.status(400).send({ message: "PSQL error" });
  } else next(err);
};
