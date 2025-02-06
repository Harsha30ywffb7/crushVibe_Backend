const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema({
  // allows for multiple people chat, participants can >2. not only two always.
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  messages: [messageSchema],
});

const Chat = new mongoose.model("Chat", chatSchema);

module.exports = { Chat };

/*
participants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      isOnline: { type: Boolean, default: false }, // Default value set to false
      lastSeen: { type: Date, default: null }, // Use Date type for last seen
    },
  ],
*/
