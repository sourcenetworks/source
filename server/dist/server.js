module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var _express = __webpack_require__(1);

	var _express2 = _interopRequireDefault(_express);

	var _path = __webpack_require__(2);

	var _path2 = _interopRequireDefault(_path);

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _server = __webpack_require__(4);

	var _app = __webpack_require__(5);

	var _app2 = _interopRequireDefault(_app);

	var _template = __webpack_require__(7);

	var _template2 = _interopRequireDefault(_template);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	// @NOTE Uncomment -> Joe's stuff
	// import Firewall from '@sourcenetworks/node-firewall';

	var app = (0, _express2['default'])();

	// @NOTE Uncomment -> Joe's stuff
	// let firewall;

	app.use(_express2['default']['static'](_path2['default'].join(__dirname, 'public')));

	app.get('/', function (req, res) {
	  var appString = (0, _server.renderToString)(_react2['default'].createElement(_app2['default'], null));

	  // @NOTE Uncomment -> Joe's stuff
	  // res.redirect(302, 'http://hotspot.localnet/index')
	  return res.send((0, _template2['default'])({
	    body: appString,
	    title: 'Source WiFi'
	  }));
	});

	app.get('/terms_accepted', function (req, res) {
	  var ip_addr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	  ip_addr = ip_addr.substring(7);

	  // @NOTE Uncomment -> Joe's stuff
	  return; /* mac = firewall.getMAC(ip_addr)
	          .then(mac => firewall.grantAccess(mac)
	          .then(() => */res.sendFile(_path2['default'].join(__dirname + '/public/terms_accepted.html'));
	});

	app.get('/index', function (req, res) {
	  // @NOTE Uncomment -> Joe's stuff
	  // res.sendFile(path.join(__dirname + '/public/index.html'));

	  var appString = (0, _server.renderToString)(_react2['default'].createElement(_app2['default'], null));

	  res.send((0, _template2['default'])(body, title));
	});

	app.listen(8080, function () {
	  // @NOTE Uncomment -> Joe's stuff
	  // firewall = new Firewall()


	  // @TODO: Logic to set interval for stuff grabbing the IP Table business
	  console.log('Source is running...');
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("react-dom/server");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _qrcode = __webpack_require__(6);

	var _qrcode2 = _interopRequireDefault(_qrcode);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var App = function (_Component) {
	  _inherits(App, _Component);

	  function App() {
	    _classCallCheck(this, App);

	    return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
	  }

	  _createClass(App, [{
	    key: 'render',
	    value: function () {
	      function render() {
	        return _react2['default'].createElement(
	          'div',
	          null,
	          _react2['default'].createElement(
	            'h1',
	            { 'class': 'Welcome-to-Source' },
	            ' Welcome to Source. '
	          ),
	          _react2['default'].createElement(
	            'h3',
	            { 'class': 'Source-is-a-ubiquito' },
	            'Source is a ubiquitous WiFi network that\u2019s secure and simple to use. Only pay for the amount of data you need. You can also sign up as a WiFi provider and make money by sharing your network. Learn more at',
	            _react2['default'].createElement(
	              'a',
	              { href: 'https://sourcewifi.com' },
	              'www.sourcewifi.com'
	            ),
	            '.'
	          ),
	          _react2['default'].createElement(
	            'a',
	            { href: '/terms_accepted' },
	            'Access Source'
	          ),
	          _react2['default'].createElement(_qrcode2['default'], { value: '0xe46a82035de48a19d9325cf43aa969e6b8cda978' }),
	          _react2['default'].createElement('img', { type: 'image/png', src: '/assets/BalloonGuy.png', 'class': 'balloon2' })
	        );
	      }

	      return render;
	    }()
	  }]);

	  return App;
	}(_react.Component);

	exports['default'] = App;

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("qrcode.react");

/***/ },
/* 7 */
/***/ function(module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports["default"] = function (_ref) {
	  var body = _ref.body,
	      title = _ref.title;

	  return "\n    <!DOCTYPE html>\n    <html>\n      <head>\n        <title>" + String(title) + "</title>\n\n        <meta charset=\"UTF-8\">\n        <meta property=\"og:type\" content=\"website\" />\n        <meta property=\"og:locale\" content=\"en_US\" />\n\n            <!-- add link to style sheet -->\n        <link rel=\"stylesheet\" href=\"/styles.css\">\n\n        <link href=\"//fonts.googleapis.com/css?family=Open+Sans:300,400,500,600,700\" rel=\"stylesheet\">\n      </head>\n\n      <body>\n        <div id=\"root\">" + String(body) + "</div>\n      </body>\n\n    </html>\n  ";
	};

	// <script src="/assets/bundle.js"></script>
	// Why is webpack necessary?

/***/ }
/******/ ]);