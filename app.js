//imports
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const categoryRoutes = require('./routes/category.routes');
const { checkUser, requireAuth } = require('./middleware/auth.middleware');

// database
const connectDB = require('./config/connect');
require('dotenv').config({ path: './config/.env' });

// packages
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// jwt
app.use('*', checkUser);
app.use('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id);
});

//  routers
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/category', categoryRoutes);

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