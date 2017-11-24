/*eslint-env node, body-parser, cfenv, express, request*/
var express = require("express");  	// this server use the libraly "express"
var cfenv = require("cfenv");      	// cfenv provides the way to accsess to the cloud foundary environment
var router = express.Router();
var expressValidator = require('express-validator');


var app = express();				// create a new express server

var appEnv = cfenv.getAppEnv();		// get the app environment from Cloud Foundry
var session = require('express-session'); // セッション用

var bodyParser = require('body-parser');	// POSTパラメータ取得用 body-parser設定 (express4から必要)

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(expressValidator());
global.vp0 = "https://4fb8dcbf117f4ca9b115905487d76fe4-vp0.us.blockchain.ibm.com:5003";
global.vp1 = "https://4fb8dcbf117f4ca9b115905487d76fe4-vp1.us.blockchain.ibm.com:5003";
global.vp2 = "https://4fb8dcbf117f4ca9b115905487d76fe4-vp2.us.blockchain.ibm.com:5003";
global.vp3 = "https://4fb8dcbf117f4ca9b115905487d76fe4-vp3.us.blockchain.ibm.com:5003";

global.chaincodeID = "5c07fcd0897a31981ec3795f1c960e41189dcf57505afe802d890f7eccb3d71e8d7e35fc58a0964c2249d81ea1ba85e4442e2dee21e38b36ec5469f376901d4e";

/* routingの設定 */
var login = require('./routes/login');
var bankapp = require('./routes/bankapp');
var reffer = require('./routes/reffer');
var refferBlock = require('./routes/refferBlock');
var refferCurrentBlock = require('./routes/refferCurrentBlock');
var refferTransaction = require('./routes/refferTransaction');
var deployChaincode = require('./routes/deployChaincode');
var history = require('./routes/history');
var register = require('./routes/register');
var logout = require('./routes/logout');

/* publicディレクトリを公開 */
app.use(express.static("public"));

/* EJSを使用 */
app.set('view engine', 'ejs');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true

}));

app.use('/login', login);
app.use('/bankapp', bankapp);
app.use('/reffer', reffer);
app.use('/refferCurrentBlock', refferCurrentBlock);
app.use('/refferBlock', refferBlock);
app.use('/refferTransaction', refferTransaction);
app.use('/deployChaincode', deployChaincode);
app.use('/history', history);
app.use('/register', register);
app.use('/logout', logout);


/* For 404 */
app.use(function(req, res, next){
    res.status(404);
    res.render('404', {title: "お探しのページは存在しません。"});
  });

app.listen(appEnv.port, "0.0.0.0", function() {
	console.log("server starting on " + appEnv.url);
});
