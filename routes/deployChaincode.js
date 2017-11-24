var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

});

router.post('/',
		function(req, res, next) {

			var request = require("request");

			var transaction_type = function() {
				return "chaincode";
			};
			var peer_url = "https://" + req.body.recvid + ":5003/"
					+ transaction_type();

			var user = "user_type2_0";

			console.log(req.body.chaincodeURL);
			console.log(peer_url);
			console.log(user);

			var options = {
				url : peer_url,
				headers : {
					"Content-type" : "application/json",
				},
				json : {
					"jsonrpc" : "2.0",
					"method" : "deploy",
					"params" : {
						"type" : 1,
						"chaincodeID" : {
							"path" : req.body.chaincodeURL,
						},
						"ctorMsg" : {
							"function" : "init",
							"args" : [ "user_type1_2", "user_type1_3",
									"user_type1_4", "user_type2_0",
									"user_type2_1", "user_type2_2",
									"user_type2_3", "user_type2_4",
									"user_type4_0", "user_type4_1",
									"user_type4_2", "user_type4_3",
									"user_type4_4", "user_type8_0",
									"user_type8_1", "user_type8_2",
									"user_type8_3", "user_type8_4" ],
						},
						"secureContext" : user
					},
					"id" : 0
				}
			};

			request.post(options, function(error, response, body) {
				res.render('deployChaincode', {
					title : 'resultOfDeploy',
					response : JSON.stringify(response),
				});
			});
		});

module.exports = router;
