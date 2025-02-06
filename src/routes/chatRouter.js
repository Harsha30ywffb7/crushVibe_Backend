const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const { Chat } = require("../models/chat");
const User = require("../models/user");

router.get("/:targetUserId", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;
    let chat = await Chat.find({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName photoUrl ",
    });
    const targetUser = await User.findOne({ _id: targetUserId });
    if (!chat) {
      chat = new Chat({
        participants: { $all: [userId, targetUserId] },
        messages: [],
      });
      await chat.save();
    }
    res.status(200).send({ data: chat, targetUser: targetUser });
  } catch (error) {
    res.status(400).send({ message: error.msg });
  }
});

module.exports = router;
