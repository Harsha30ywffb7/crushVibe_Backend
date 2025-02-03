const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: {
        values: ["accepted", "interested", "ignored", "rejected"],
        message: `{VALUE} is incorrect status type `,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

connectionSchema.index({ fromUserId: 1, toUserId: 1 });

connectionSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("cannot send a connection request to yourself!!!!!");
  }
  next();
});

const ConnectionRequest = new mongoose.model(
  "connectionRequest",
  connectionSchema
);

module.exports = ConnectionRequest;
