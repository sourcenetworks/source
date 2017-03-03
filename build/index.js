var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nodeFirewall = require('@sourcenetworks/node-firewall');

var _nodeFirewall2 = _interopRequireDefault(_nodeFirewall);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var app = (0, _express2['default'])();
var firewall = void 0;

app.use(_express2['default']['static'](_path2['default'].join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.redirect(302, 'http://hotspot.localnet/index');
});

app.get('/terms_accepted', function (req, res) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  ip = ip.substring(7);

  return firewall.getMAC(ip).then(function (mac) {
    return firewall.grantAccess(mac);
  }).then(function () {
    return res.sendFile(String(__dirname) + '/public/terms_accepted.html');
  });
});

app.get('/index', function (req, res) {
  res.sendFile(String(__dirname) + '/public/index.html');
});

app.listen(80, function () {
  firewall = new _nodeFirewall2['default']();
  console.log('Source is running...');
});