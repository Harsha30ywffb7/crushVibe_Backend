const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const { validateEditData } = require("../utils/validations.js");

router.get("/view", userAuth, (req, res) => {
  try {
    const user = req.user; // user is coming from middleware
    if (user)
      return res
        .status(200)
        .send({ user: user, message: "User found successfully" });
  } catch (error) {
    return res.status(400).send({ error: error, message: "User not found" });
  }
});

router.patch("/edit", userAuth, (req, res) => {
  // allow only editable fields (expect email and password from here)
  console.log("entering into the api");
  try {
    if (!validateEditData) {
      throw new Error("invalid edit fields");
    }
    const loggedInUser = req.user;

    console.log(req.body);

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key])); //updates user fields

    loggedInUser.save();
    res.status(200).send({
      message:
        `${loggedInUser.firstName} ` + "Your profile updated successfully",
      user: loggedInUser,
    });
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

module.exports = router;
