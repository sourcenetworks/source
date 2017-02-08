const express   =   require('express');
const firewall  =   require('firewall');

const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(4040, function () {
  console.log('Example app listening on port 3000!')
})
