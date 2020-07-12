const express = require('express');
const bodyParser = require('body-parser');
const cors = require ('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/api/credits', (req, res) => res.status(200).send({ msg: 'This project is developed by AliHafeez337.' }))


// HANDLE PRODUCTION
if (process.env.NODE_ENV === 'production'){
  // Static folder
  app.use(express.static(__dirname, + '/public/'))

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname, + '/public/index.html'))
}


app.listen(3000, () => {
  console.log(`Server started on 3000`);
});
