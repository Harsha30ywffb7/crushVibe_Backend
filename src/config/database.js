const mongoose = require("mongoose");

const mongoURI =
  "mongodb+srv://harshavardhangulla2003:MeedXLg6jafWRVOx@tinder.yr1o3.mongodb.net/?retryWrites=true&w=majority&appName=Tinder";

const dbConnection = async () => {
  await mongoose.connect(mongoURI);
};

module.exports = { dbConnection };
