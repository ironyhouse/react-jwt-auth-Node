const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const PORT = 5000;
// create app instance
const app = express();

// run server
const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server started on PORT = ${5000}`));
  } catch (e) {
    console.log(e);
  }
};

start();
