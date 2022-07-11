const mongoose = require('mongoose')

const connectDB = (url) => {
  return mongoose.connect(url)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Failed to connect to MongoDB", err));
}

module.exports = connectDB
