import express from "express";
import User from "../../models/User";

// Instance of express router
const router = express.Router();

router.get("/users", async function (req, res, next) {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      message: "Users fetched successfully.",
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Failed get users data",
    });
  }
});

export default router;
