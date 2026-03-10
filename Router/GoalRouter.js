// GoalRouter.js
const express = require("express");
const router = express.Router();
const goalModel = require("../Model/GoalModel");
const authmiddleware = require("../Middlewares/authMiddleware");

// ✅ Create a new goal
router.post("/create", authmiddleware, async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const goal = new goalModel({
      title: title,
      user: req.user, // from authmiddleware
    });

    await goal.save();

    res.status(201).json({
      success: true,
      data: goal,
    });
  } catch (err) {
    next(err);
  }
});

// ✅ Get all goals for logged-in user
router.get("/", authmiddleware, async (req, res, next) => {
  try {
    const goals = await goalModel.find({ user: req.user });
    res.status(200).json({
      success: true,
      data: goals,
    });
  } catch (err) {
    next(err);
  }
});

// ✅ Get single goal by ID
router.get("/:id", authmiddleware, async (req, res, next) => {
  try {
    const goal = await goalModel.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!goal) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (err) {
    next(err);
  }
});

// ✅ Update goal (mark completed or change title)
router.put("/:id", authmiddleware, async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.title) updates.title = req.body.title;
    if (req.body.completed !== undefined) updates.completed = req.body.completed;

    const updatedGoal = await goalModel.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      updates,
      { new: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({ success: false, message: "Goal not found or not yours" });
    }

    res.status(200).json({
      success: true,
      message: "Goal updated successfully",
      data: updatedGoal,
    });
  } catch (err) {
    next(err);
  }
});

// ✅ Delete goal
router.delete("/:id", authmiddleware, async (req, res, next) => {
  try {
    const deletedGoal = await goalModel.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!deletedGoal) {
      return res.status(404).json({ success: false, message: "Goal not found or not yours" });
    }

    res.status(200).json({
      success: true,
      message: "Goal deleted successfully",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;