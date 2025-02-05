const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

const SECRET_KEY = "Elonolan444";

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isvalidPassword = await bcrypt.compare(password, user.password);
    if (isvalidPassword) {
      // authenticate token
      const token = jwt.sign({ id: user._id }, SECRET_KEY, {
        expiresIn: "30d",
      });

      // Add token to the cookie.
      res.cookie("token", token);
      res.status(200).send({ message: "Login successfull", user: user });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send({ message: "Invalid data", error: error });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      photoUrl,
      hobbies,
      gender,
      age,
    } = req.body;
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      return res.status(400).send({ message: "Email already exists" });
    }

    // validation of data
    const passwordHash = await bcrypt.hash(password, 10);
    // encrypt password

    // push into db
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: passwordHash,
      photoUrl: photoUrl,
      hobbies: hobbies,
      gender: gender,
      age: age,
    });
    await user.save();
    return res.send({ message: "User created successfully", user: user });
  } catch (error) {
    return res.status(400).send({ message: "Invalid data", error: error });
  }
});

router.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, { expires: new Date(Date.now()) }); // expires right now.
    res.status(200).send({ message: "user logged out successfully" });
  } catch (error) {
    res.status(404).send({ error: error });
  }
});

router.get("/feed", async (req, res) => {
  const users = await User.find(); // get all users
  try {
    res.status(200).send({ users: users });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/user", async (req, res) => {
  const user = await User.findById(req.body.email);
  try {
    if (user)
      res.status(200).send({ user: user, message: "User found successfully" });
  } catch (error) {
    res.status(500).send({ error: error, message: "User not found" });
  }
});

router.delete("/delete", async (req, res) => {
  const user = await User.findOneAndDelete(req.body.email);
  try {
    if (user)
      res
        .status(200)
        .send({ user: user, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error, message: "User not found" });
  }
});

router.patch("/update/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const ALLOWED_UPATES = ["age", "gender", "photoUrl", "about", "hobbies"];
    const isUpdateAllowed = Object.keys(req.body).every((update) =>
      ALLOWED_UPATES.includes(update)
    );

    if (!isUpdateAllowed) {
      throw new Error("Unble to update");
    }

    if (req.body?.skills.length > 10) {
      throw new Error("Skills must be less than 10");
    }

    const user = await User.findByIdAndUpdate(userId, req.body, {
      returnDocument: "after",
      runValidators: true, // returns the updated document
    });
    if (user)
      res
        .status(200)
        .send({ user: user, message: "User updated successfully" });
  } catch (error) {
    res.status(400).send({ error: error, message: "User not found" });
  }
});

module.exports = router;
