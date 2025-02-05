const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

router.post("/send/:status/:userId", userAuth, async (req, res) => {
  try {
    const status = req.params.status;
    const toUserId = req.params.userId;
    const fromUserId = req.user._id;

    const allowedStatuses = ["ignored", "interested"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).send({ message: "Invalid requet status" });
    }
    //check to user is exists or not.
    const toUser = await User.find({ _id: toUserId });

    if (!toUser) {
      return res.status(400).send({ message: "User does not exists" });
    }

    if (fromUserId.toHexString() === toUserId) {
      // we can check like this but also we can use pre middleware  in schema.
      return res
        .status(400)
        .send("cannot send a connection request to yourself!!!!!");
    }

    //if there is an existing connection request, no need to send again
    const existingConnection = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    // already connection request from you or from other, then stop request again

    if (existingConnection) {
      return res
        .status(404)
        .send({ message: "Connection request already exists" });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    if (data) {
      return res.status(200).send({
        message: `${req.user.firstName} is ${status} in ${toUser[0].firstName}`,
        data: data,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "failed to send connection request.", error: error });
  }
});

router.post("/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatuses = ["accepted", "rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).send({ message: "status not allowed" });
    }

    // only see your requests, people who sent to you. and status must be interested then only you get request.
    const yourRequest = await ConnectionRequest.findOne({
      fromUserId: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!yourRequest) {
      return res.status(404).send({ message: "connection request not found" });
    }

    yourRequest.status = status;

    const data = await yourRequest.save();

    return res
      .status(200)
      .send({ message: "connection request" + status, status: status });
  } catch (error) {
    res.status(400).send({ message: "Error in reviewing request ", error });
  }
});

module.exports = router;
