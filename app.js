const express = require('express');

const app = express();

const connectDB = require('./config/connect');
require('dotenv').config({ path: './config/.env' });

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();