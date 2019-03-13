require('dotenv').config(); // this allows us to use the process variables
const express = require('express');
const bodyParser = require('body-parser'); // Requiring body-parser to obtain the body from post requests

const app = express();
const port = process.env.PORT || 3000;

// Set Express to use body-parser as a middleware //
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send('Yea this works');
});

app.post('/signup', (req, res) => {
  const userInfo = req.body;
  res.status(201).send(userInfo);
});

app.listen(port, () => console.log(`Listening on port ${port}`));