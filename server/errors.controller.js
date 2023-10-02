exports.failsafe = (err, req, res, next) => {
  console.log(err); // troubleshooting unexpected errors and oversights
  res.status(500).send("internal server error");
};
