var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

  if (req.session.user_id) {
    res.redirect('/bankapp');
  } else {


    res.render('login', {
      title: 'ログイン画面'
    });

  }
});

router.post('/', function(req, res, next) {

	var id = req.body.id;
	var pw = req.body.pw;

	req.assert('id', 'Enter senid').notEmpty();
	req.assert('pw', 'Enter recvid').notEmpty();

	var errors = req.validationErrors();

	if(errors){

		res.render('login', {
			title: 'ログイン',
			noUser: 'ログインできません。'
		});

	}else{
		/* 認証するJSON */
		var cert_json = {
				url : global.vp0 + "/chaincode",
				headers : {
					"Content-type" : "application/json",
				},
				json : {
					"jsonrpc" : "2.0",
					"method" : "query",
					"params" : {
						"type" : 1,
						"chaincodeID" : {
							"name" : global.chaincodeID
						},
						"ctorMsg" : {
							"function" : "cert",
							"args" :  [ id, pw ] ,
						},
						"secureContext" : "user_type1_0"
					},
						"id" : 0
				}
		};

		var request = require("request");
		var statusCode = '0';
		var LOGIN_SUCCESS = '200';

		request.post(cert_json, function(error, response, body) {
			statusCode = JSON.stringify(response.statusCode);
			console.log("error" + error);
			console.log("error2 :"+ body.error);
			console.log("error3 :"+ JSON.stringify(body.error));

			console.log("body2 :"+ JSON.stringify(body));

			if(body.error == null){
				console.log("login success");
				req.session.user_id = id;
				res.redirect("/bankapp");
			}else{

				console.log("login fail");
				res.redirect("/bankapp");
/*
				res.render('login', {
					title: 'ログイン',
					noUser: 'ログインできません。'
				});
*/
			}
		});
	}
});

module.exports = router;