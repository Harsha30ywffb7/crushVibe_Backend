const jwt = require("jsonwebtoken");
const User = require("../models/user");

const SECRET_KEY = "Elonolan444";

const userAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;

    if (!cookie) {
      throw new Error("Token not found");
    }
    const decodeCookie = jwt.verify(cookie.token, SECRET_KEY);
    console.log(decodeCookie);
    const { id } = decodeCookie;

    const user = await User.findById(id);

    if (user) console.log("Auth successful at middleware");
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send({ error: error, message: "jwt expired " });
  }
};

module.exports = { userAuth };
