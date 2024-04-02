const router = require("express").Router();
const { param } = require("express-validator");
const validation = require("../handlers/validation");
const tokenHandler = require("../handlers/tokenHandler");
const boardController = require("../controllers/board");

router.post("/", tokenHandler.verifyToken, boardController.create);

router.get("/", tokenHandler.verifyToken, boardController.getAll);

router.put("/", tokenHandler.verifyToken, boardController.updatePosition);

router.get(
  "/favorites",
  tokenHandler.verifyToken,
  boardController.getFavourites
);

router.get(
  "/:boardId",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid id");
    } else return Promise.resolve();
  }),
  validation.validate,
  tokenHandler.verifyToken,
  boardController.getOne
);

// router.put(
//   "/:boardId",
//   param("boardId").custom((value) => {
//     if (!validation.isObjectId(value)) {
//       return Promise.reject("invalid id");
//     } else return Promise.resolve();
//   }),
//   validation.validate,
//   tokenHandler.verifyToken,
//   boardController.update
// );

router.put(
  "/:boardId/icon",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid id");
    } else return Promise.resolve();
  }),
  validation.validate,
  tokenHandler.verifyToken,
  boardController.updateIcon
);

router.put(
  "/:boardId/overview",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid id");
    } else return Promise.resolve();
  }),
  validation.validate,
  tokenHandler.verifyToken,
  boardController.updateTitleAndDescription
);

router.delete(
  "/:boardId/delete",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid id");
    } else return Promise.resolve();
  }),
  validation.validate,
  tokenHandler.verifyToken,
  boardController.delete
);

router.put(
  "/:boardId/favorite",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid id");
    } else return Promise.resolve();
  }),
  validation.validate,
  tokenHandler.verifyToken,
  boardController.updateFavourite
);

router.put(
  "/favorites",
  tokenHandler.verifyToken,
  boardController.updateFavouritePosition
);

module.exports = router;
