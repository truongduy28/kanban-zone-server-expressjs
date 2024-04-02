const Board = require("../models/board");
const Section = require("../models/section");
const Task = require("../models/task");

exports.create = async (req, res) => {
  try {
    const boardsCount = await Board.find().count();
    const board = await Board.create({
      user: req.user._id,
      position: boardsCount > 0 ? boardsCount : 0,
    });
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getAll = async (req, res) => {
  try {
    const boards = await Board.find({ user: req.user._id }).sort("-position");
    res.status(200).json(boards);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updatePosition = async (req, res) => {
  const { boards } = req.body;
  try {
    for (const key in boards.reverse()) {
      const board = boards[key];
      await Board.findByIdAndUpdate(board.id, { $set: { position: key } });
    }
    res.status(200).json("updated");
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getOne = async (req, res) => {
  const { boardId } = req.params;
  try {
    const board = await Board.findOne({ user: req.user._id, _id: boardId });
    if (!board) return res.status(404).json("Board not found");
    const sections = await Section.find({ board: boardId });
    for (const section of sections) {
      const tasks = await Task.find({ section: section.id })
        .populate("section")
        .sort("-position");
      section._doc.tasks = tasks;
    }
    board._doc.sections = sections;
    res.status(200).json(board);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateFavourite = async (req, res) => {
  const { boardId } = req.params;
  const { favourite } = req.body;

  try {
    const currentBoard = await Board.findById(boardId);
    if (!currentBoard) return res.status(404).json("Board not found");

    if (favourite !== undefined && currentBoard.favourite !== favourite) {
      const favourites = await Board.find({
        user: currentBoard.user,
        favourite: true,
        _id: { $ne: boardId },
      }).sort("favouritePosition");
      if (favourite) {
        req.body.favouritePosition =
          favourites.length > 0 ? favourites.length : 0;
      } else {
        for (const key in favourites) {
          const element = favourites[key];
          await Board.findByIdAndUpdate(element.id, {
            $set: { favouritePosition: key },
          });
        }
      }
    }

    const board = await Board.findByIdAndUpdate(boardId, { $set: req.body });
    res.status(200).json(board);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateIcon = async (req, res) => {
  const { boardId } = req.params;
  const { icon } = req.body;

  try {
    const currentBoard = await Board.findById(boardId);
    if (!currentBoard) return res.status(404).json("Board not found");

    // Update the icon property of the board
    currentBoard.icon = icon;
    await currentBoard.save();

    res.status(200).json(currentBoard);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateTitleAndDescription = async (req, res) => {
  const { boardId } = req.params;
  const { title, description } = req.body;

  try {
    const currentBoard = await Board.findById(boardId);
    if (!currentBoard) return res.status(404).json("Board not found");

    if (title !== undefined) {
      currentBoard.title = title === "" ? "Untitled" : title;
    }
    if (description !== undefined) {
      currentBoard.description =
        description === ""
          ? `Add description here
        🟢 You can add multiline description
        🟢 Let's start...`
          : description;
    }

    await currentBoard.save();

    res.status(200).json(currentBoard);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.delete = async (req, res) => {
  const { boardId } = req.params;
  try {
    const sections = await Section.find({ board: boardId });
    for (const section of sections) {
      await Task.deleteMany({ section: section.id });
    }
    await Section.deleteMany({ board: boardId });

    const currentBoard = await Board.findById(boardId);

    if (currentBoard.favourite) {
      const favourites = await Board.find({
        user: currentBoard.user,
        favourite: true,
        _id: { $ne: boardId },
      }).sort("favouritePosition");

      for (const key in favourites) {
        const element = favourites[key];
        await Board.findByIdAndUpdate(element.id, {
          $set: { favouritePosition: key },
        });
      }
    }

    await Board.deleteOne({ _id: boardId });

    const boards = await Board.find().sort("position");
    for (const key in boards) {
      const board = boards[key];
      await Board.findByIdAndUpdate(board.id, { $set: { position: key } });
    }

    res.status(200).json("deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getFavourites = async (req, res) => {
  console.log("first");
  try {
    const favourites = await Board.find({
      user: req.user._id,
      favourite: true,
    }).sort("-favouritePosition");
    res.status(200).json(favourites);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateFavouritePosition = async (req, res) => {
  const { boards } = req.body;
  try {
    for (const key in boards.reverse()) {
      const board = boards[key];
      await Board.findByIdAndUpdate(board.id, {
        $set: { favouritePosition: key },
      });
    }
    res.status(200).json("updated");
  } catch (err) {
    res.status(500).json(err);
  }
};
