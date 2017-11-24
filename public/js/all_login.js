/*eslint-env node, body-parser, cfenv, express, request*/
var express = require("express");  	// this server use the libraly "express"
var cfenv = require("cfenv");      	// cfenv provides the way to accsess to the cloud foundary environment
var app = express();				// create a new express server
var appEnv = cfenv.getAppEnv();		// get the app environment from Cloud Foundry
var bodyParser = require('body-parser');	// POST�p�����[�^�擾�p body-parser�ݒ� (express4����K�v)

var info = require("./ServiceCredentials.json"); //get data of ServiceCredentials.json
info = JSON.parse(JSON.stringify(info));

app.use(express.static(__dirname + "/public"));	// serve the files out of ./public as our main files
app.use(bodyParser.urlencoded({	extended : true}));
app.use(bodyParser.json());

app.post("/", function(req, res) {

	//--peer�ɑ΂��ē�����json�f�[�^���쐬--//


	var transaction_type = function(){ //decision transaction type�i��ł����Ǝg����悤�ɂ���\��...�j
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

	//--peer�ɑ΂���json�𓊂��āAresponse���擾��N���C�A���g�֑��M--//

	request.post(options, function(error) {

		console.log("error");

	});

});

app.listen(appEnv.port, "0.0.0.0", function() {
	console.log("server starting on " + appEnv.url);

});


