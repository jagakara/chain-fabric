/*eslint-env node, body-parser, cfenv, express, request*/
var express = require("express");  	// this server use the libraly "express"
var cfenv = require("cfenv");      	// cfenv provides the way to accsess to the cloud foundary environment
var app = express();				// create a new express server
var appEnv = cfenv.getAppEnv();		// get the app environment from Cloud Foundry
var bodyParser = require('body-parser');	// POSTパラメータ取得用 body-parser設定 (express4から必要)

var info = require("./ServiceCredentials.json"); //get data of ServiceCredentials.json
info = JSON.parse(JSON.stringify(info));

app.use(express.static(__dirname + "/public"));	// serve the files out of ./public as our main files
app.use(bodyParser.urlencoded({	extended : true}));
app.use(bodyParser.json());

app.post("/", function(req, res) {

	//--peerに対して投げるjsonデータを作成--//


	var transaction_type = function(){ //decision transaction type（後でもっと使えるようにする予定...）
		return "registrar";
	}

	var ca_url = "grpcs://"+b23476f36d234c06aff5e3f1822e3c03-ca.us.blockchain.ibm.com+":"+30003; //make url of ca
	var request = require("request");
	var login = JSON.parse(JSON.stringify(req.body));

	var options = {
			url : ca_url,
			headers : {
				"Content-type" : "application/json",
			},
			json :{
				  "enrollId": login.item1,
				  "enrollSecret": login.item2
				}
	};

	console.log(login);

	//--peerに対してjsonを投げて、responseを取得後クライアントへ送信--//

	request.post(options, function(error) {

		console.log("error");

	});

});

app.listen(appEnv.port, "0.0.0.0", function() {
	console.log("server starting on " + appEnv.url);

});


