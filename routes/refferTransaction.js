var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('refferTransaction',{
		title: 'UseAPI'
	});
});

router.post('/', function(req, res, next) {

	var request = require("request");

	req.assert('transactionID', 'トランザクションNoを入力してください。').notEmpty();

	var errors = req.validationErrors();
	
	if(errors){
		console.log("reffertransaction error")

		emsg = "";
		errors.forEach(function (error) {
				emsg = emsg + error.msg + "\n";
		});

		res.render('refferTransaction', {
			title: 'TransactionInfomation',
			chaincodeID: "nothing",
			payload:"nothing",
			txid:"nothing",
			timestamp:"nothing",
			emsg:emsg,
		});
	}else{	
		/* requestURL */
		var options = "";
		if(req.body.recvid = "peer1"){
			options = global.vp0 + "/transactions/"+req.body.transactionID;
		}else if(req.body.recvid = "peer2"){
			options = global.vp1 + "/transactions/"+req.body.transactionID;
		}else if(req.body.recvid = "peer3"){
			options = global.vp2 + "/transactions/"+req.body.transactionID;
		}else if(req.body.recvid = "peer4"){
			options = global.vp3 + "/transactions/"+req.body.transactionID;
		}else{
			options = global.vp0 + "/transactions/"+req.body.transactionID;
		}
	
		request.get(options, function(error, response, body) {
			
			if(response.statusCode == "404"){
				console.log("error :" + error);
				console.log("status :" + response.statusCode);
				
				res.render('refferTransaction', {
					title: 'TransactionInfomation',
					chaincodeID: "nothing",
					payload:"nothing",
					txid:"nothing",
					timestamp:"nothing",
					emsg:"トランザクションが見つかりませんでした。",
				});
				
			}else{
				var body = JSON.parse(body);
	
				console.log(body);
				
				var decode = body.payload.toString("ascii")
				var buffer = new Buffer(decode,'Base64').toString();
				var textArray = buffer.split(/\n/);
				
				console.log(textArray);
				
				for (var i = 0; i < textArray.length; i++){
					console.log(textArray[2]);
				}
		
				res.render('refferTransaction', {
					title: 'TransactionInfomation',
					chaincodeID: body.chaincodeID,
					payload:body.payload,
					txid:body.txid,
					timestamp:body.timestamp.seconds,
				});
			}
		});
	}
});

module.exports = router;