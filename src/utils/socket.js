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

/*
const socket = require("socket.io");
const { Chat } = require("../models/chat");
const User = require("../models/user");

const intialiseSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    socket.on("joinChat", async ({ firstName, userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      socket.join(roomId);
      // update users status in db as online.
      onlineUsers.set(userId, socket.id);
      await Chat.updateOne(
        { "participants.user": userId },
        { $set: { "participants.isOnline": true } }
      );

      io.emit("userStatusUpdate", { userId, isOnline: true });
    });

    socket.on("disconnect", async () => {
      console.log("called disconnect");
      const userId = [...onlineUsers.entries()].find(
        ([_, id]) => id === socket.id
      )?.[0];

      if (userId) {
        // Remove from map
        onlineUsers.delete(userId);

        // Update database (set isOnline: false, update lastSeen)
        await Chat.updateOne(
          { "participants.user": userId },
          {
            $set: {
              "participants.$.isOnline": false,
              "participants.$.lastSeen": new Date(),
            },
          }
        );

        // Notify other users
        io.emit("userStatusUpdate", {
          userId,
          isOnline: false,
          lastSeen: new Date(),
        });
      }
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

*/
