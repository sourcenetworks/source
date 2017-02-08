const express   =   require('express');
const firewall  =   require('./firewall');

const app = express();

app.get('/test', function (req, res) {
  res.send(firewall.testFunction());
})

app.listen(4040, function () {
  console.log('Source server running on port 4040...')
})
