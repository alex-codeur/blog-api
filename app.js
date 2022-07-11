require('dotenv').config({ path: './config/.env' });

//imports
const userRoutes = require('./routes/user.routes');

// database
const connectDB = require('./config/connect');

// packages
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//  routers
app.use('/api/user', userRoutes);

// server
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