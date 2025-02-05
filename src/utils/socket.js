const socket = require("socket.io");
const { Chat } = require("../models/chat");

const intialiseSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, text, photoUrl }) => {
        try {
          const roomId = [userId, targetUserId].sort().join("_");

          // save chat in db.
          let chat = await Chat.findOne({
            participants: {
              $all: [userId, targetUserId],
            },
          });
          // if not found create a new chat
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({ senderId: userId, text });

          await chat.save();
          // sending msgs which comes to socket into the room where participants are there.
          io.to(roomId).emit("messageReceived", {
            firstName,
            text,
            userId,
            photoUrl,
          });
        } catch (error) {
          console.log(error);
        }
      }
    );
  });
};

module.exports = intialiseSocket;
