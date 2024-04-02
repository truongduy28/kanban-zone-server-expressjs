var router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/boards", require("./board"));
router.use("/boards/:boardId/sections", require("./section"));
router.use("/boards/:boardId/tasks", require("./task"));

console.log(
  `The server has started at port ${process.env.PORT}, the routes are available 🚀`
);

module.exports = router;
