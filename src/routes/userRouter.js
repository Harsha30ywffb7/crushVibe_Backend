const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const router = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender photoUrl hobbies about";

router.get("/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // your requests.
    const requestsReceived = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    const data = requestsReceived.map((user) => user.fromUserId);

    res.status(200).send({ data: data });
  } catch (error) {
    res.status(400).send({ message: "page not found", error: error });
  }
});

router.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((user) => {
      if (user.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return user.toUserId;
      }
      return user.fromUserId;
    });

    res.send({ data: data });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10; // large limits can make database queries more expensive.
    limit = limit > 100 ? 100 : limit;
    const skip = (page - 1) * limit;
    // feed user can only see his sent+ received people feed.
    // user can't see his (own profile + ignored + already connection sent to people + existing connections)

    //find connections of  user.
    const allConnections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    //unique userIds
    const hideUsersFromFeed = new Set();
    allConnections.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    // block all these users from feed.
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit); // for users based on pagination limit

    res.status(200).send({ data: users });
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

module.exports = router;
