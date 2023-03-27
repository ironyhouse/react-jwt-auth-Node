require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./router/index');

// add default PORT
const PORT = process.env.PORT || 5000;
// create app instance
const app = express();

// add middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);

// run server
const start = async () => {
  try {
    // connect to data base
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
