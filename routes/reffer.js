var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('reffer',{
		title: 'UseAPI'
	});
});

router.post('/', function(req, res, next) {

	var id = req.body.id;
	var pw = req.body.pw;

	/* Ecertを作成するJSON */
	var create_ecert_json = {
			url : "https://b23476f36d234c06aff5e3f1822e3c03-vp0.us.blockchain.ibm.com:5003/registrar",
			headers : {
				"Content-type" : "application/json",
				"Accept": "application/json"
			},
			json :{
				  "enrollId": id,
				  "enrollSecret": pw
				}
	};

	var request = require("request");
	var statusCode = '0';
	var CREATE_SUCCESS = '200';

	if(req.session.user_id){
		console.log("already login");
		res.redirect("/reffer");
	}else{
		request.post(create_ecert_json, function(error, response, body) {
			statusCode = JSON.stringify(response.statusCode);
			console.log(statusCode);
			console.log(body);

			var ok="0";
			if(statusCode == CREATE_SUCCESS){
				console.log("create ok");

				/* TODO 本当はもっといい認証方法を考える */
				var info = require("../ServiceCredentials.json");
				info = JSON.parse(JSON.stringify(info));
				Object.keys(info.users).forEach(function(key){
					if(info.users[key].enrollId == id && info.users[key].enrollSecret == pw){
						ok = "1";
					}
				});
			}

			if(ok == "1"){
				req.session.user_id = id;
				res.redirect("/reffer");
			}else{
				res.render('login', {
					title: 'ログイン',
					noUser: 'ログインできません。'
				});
			}
		});
	}
});

module.exports = router;