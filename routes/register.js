var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

    res.render('register', {
      title: '新規登録'
    });

});


router.post('/', function(req, res, next) {

	var request = require("request");

	var id = req.body.id;
	var pw1 = req.body.pw1;
	var pw2 = req.body.pw2;

	req.assert('id', 'IDを入力してください。').notEmpty();
	req.assert('pw1', '1個目のパスワードを入力してください。').notEmpty();
	req.assert('pw2', '2個目のパスワードを入力してください。').notEmpty();

	var errors = req.validationErrors();

	if(errors){

		emsg = "";
		errors.forEach(function (error) {
				emsg = emsg + error.msg + "\n";
		});

		res.render('register', {
			title: '新規登録',
			emsg: emsg
		});
		
	}else{

		/* 新規登録するJSON */
		var register_json = {
				url : global.vp0 + "/chaincode",
				headers : {
					"Content-type" : "application/json",
				},
				json : {
					"jsonrpc" : "2.0",
					"method" : "invoke",
					"params" : {
						"type" : 1,
						"chaincodeID" : {
							"name" : global.chaincodeID
						},
						"ctorMsg" : {
							"function" : "register",
							"args" :  [ id, pw1 ] ,
						},
						"secureContext" : "admin"
					},
						"id" : 0
				}
		};
	    
		request.post(register_json, function(error, response, body) {
			statusCode = JSON.stringify(response.statusCode);
	
			if(error == null && pw1 == pw2){
				res.render('login', {
					title: 'ログイン',
					msg: '登録が完了しました。ログインしてください。'
				});
			}else{
				res.render('register', {
					title: '新規登録',
					emsg: '登録できませんでした。'
				});
			}
		});
	}
	
});

module.exports = router;