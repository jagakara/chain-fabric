var express = require('express');
var router = express.Router();
var request = require("request");
var async = require('async');

router.get('/', function(req, res, next) {

	user = "ryosuke";
    var balance = -1;

    if (false) {
		res.redirect('/login');
    }else{

    async.parallel({
    	  balance: function(callback) {
  			console.log("残高照会");

  			console.log("user :"+user);

			var get_amount_json = {
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
								"function" : "getBalance",
								"args" : [
									user
								]
							},
							"secureContext" : "admin"
						},
							"id" : 0
					}
			};

			request.post(get_amount_json, function(error, response, body) {
				console.log("balance finish");
				console.log("error :"+error);
				console.log("status :"+response.statusCode);

				console.log("body :"+ JSON.stringify(body));

				//callback(null, body.result.message);
			});

    	  },
    	  id_list: function(callback) {
  			console.log("送信者リストを作成");

			var id_list = [];

			var get_user_json = {
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
								"function" : "getUser",
								"args" : [	]
							},
							"secureContext" : "admin"
						},
							"id" : 0
					}
			};

			request.post(get_user_json, function(error, response, body) {
				console.log("userlist finish");
				console.log("error :"+error);
				console.log("status :"+response.statusCode);

				console.log("body :"+ JSON.stringify(body));

				async.each(JSON.parse(body.result), function(key, callback){
					if(key[0] != user){
						id_list.push(key[0]);
					}
					callback();
				}, function(err){
					console.log("id_list finish");
					callback(null, id_list)
				});

		  });
    	}
    	}, function(err, results) {
    	  if (err) {
    	    throw err;
    	  }
    	  console.log('parallel done');
    	  console.log("result :");
    	  console.log(results);

  		if (user) {
  			console.log("1");
  			if(req.session.eno == 1){
  	  			console.log("2");

  				req.session.eno = null;
  				console.log("1");
  				res.render('bankapp', {
  					title: 'メインメニュー',
  						sendid: user,
  						balance:  results.balance,
  						recvid: results.id_list,
  						emsg: "残高が足りません。",
  				});

  			}else if(req.session.errors){
  	  			console.log("3");

  				emsg = "";
   				req.session.errors.forEach(function (error) {
   					emsg = emsg + error.msg + "\n";
  				});
  				req.session.errors = null;

  				res.render('bankapp', {
  					title: 'メインメニュー',
  						sendid: user,
  						balance:  results.balance,
  						recvid: results.id_list,
  						emsg: emsg,
  				});

  			}else{
  	  			console.log("4");

  				res.render('bankapp', {
  					title: 'メインメニュー',
  						sendid: user,
  						balance:  results.balance,
  						recvid: results.id_list,
  				});


  			}
	  			console.log("5");

		}else{
  			console.log("6");

			res.redirect('/login');
		}



    	});

    }
});

router.post('/', function(req, res, next) {

	/* select-formのデータを受け取る */
	var requestBody = req.body;
	var sendid = requestBody.sendid;
	var recvid = requestBody.recvid;
	var amount = requestBody.AmountOfMoney;
	console.log(requestBody);

	req.assert('sendid', 'Enter senid').notEmpty(sendid);
	req.assert('recvid', 'Enter recvid').notEmpty(recvid);
	req.assert('AmountOfMoney', '数値を入力してください。').isInt();

	var errors = req.validationErrors();

	if(errors){

		errors.forEach(function(error){
			console.log("validation error :" + error.msg);
		});

		req.session.errors = errors;

		setTimeout(function(){
			res.redirect("/bankapp");
		},2000);

	}else{

	/* ブロックチェーンに送信するJSONを作成 */
	var json_args = [ sendid, recvid, amount ];
	var user = req.session.user_id;

	var errors = req.validationErrors();

	async.waterfall([
		  function(callback) {

				var get_amount_json = {
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
									"function" : "getBalance",
									"args" : [
										user
									]
								},
								"secureContext" : "admin"
							},
								"id" : 0
						}
				};

				request.post(get_amount_json, function(error, response, body) {
					callback(null, body.result.message);
				});
		  },
		], function(err, balance) {

			var transfer_json = {
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
							"function" : "transfer",
							"args" :  json_args ,
						},
						"secureContext" : "admin"
					},
					"id" : 0
				}
			};

			if(balance - amount >= 0){
				request.post(transfer_json, function(error, response, body) {
					console.log("transfer done");
				});

				setTimeout(function(){
					res.redirect("/bankapp");
				},2000);
			}else{
				console.log("no more balance");

				req.session.eno = 1; //no more balance

				setTimeout(function(){
					res.redirect("/bankapp");
				},2000);

			}
		});
	}
});

module.exports = router;
