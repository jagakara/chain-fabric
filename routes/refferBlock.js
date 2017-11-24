var express = require('express');
var router = express.Router();
var request = require("request");

router.get('/', function(req, res, next) {
	res.render('refferBlock',{
		title: 'UseAPI'
	});
});

router.post('/', function(req, res, next) {

	console.log(req.body.recvid);
	console.log(req.body.blockNo);
	
	req.assert('blockNo', 'ブロック高を入力してください。').isInt();

	var errors = req.validationErrors();
	
	if(errors){
		console.log("refferblock error")

		emsg = "";
		errors.forEach(function (error) {
				emsg = emsg + error.msg + "\n";
		});

		res.render('refferBlock', {
			title: 'BlockInfomation',
			txlist:"nothing",
			emsg: emsg,
		});
	}else{
	
		/* requestURL */
		var options = "";
		if(req.body.recvid = "peer1"){
			options = global.vp0 + "/chain/blocks/"+req.body.blockNo;
		}else if(req.body.recvid = "peer2"){
			options = global.vp1 + "/chain/blocks/"+req.body.blockNo;
		}else if(req.body.recvid = "peer3"){
			options = global.vp2 + "/chain/blocks/"+req.body.blockNo;
		}else if(req.body.recvid = "peer4"){
			options = global.vp3 + "/chain/blocks/"+req.body.blockNo;
		}else{
			options = global.vp0 + "/chain/blocks/"+req.body.blockNo;
		}
	
		request.get(options, function(error, response, body) {
			if(response.statusCode == "404"){
				console.log("error :" + error);
				console.log("status :" + response.statusCode);
				
				res.render('refferBlock', {
					
					title: 'BlockInfomation',
					stateHash: "nothing",
					previousBlockHash:"nothing",
					txlist:"nothing",
					emsg:"ブロックが見つかりませんでした。",
				});
				
			}else{
				body = JSON.parse(body);
				console.log(body);
				console.log(JSON.stringify(body.transactions));
		
				if(body.transactions == null){
					res.render('refferBlock', {
		
						title: 'BlockInfomation',
						stateHash: body.stateHash,
						previousBlockHash:body.previousBlockHash,
						txlist:"nothing",
					});
				}else{
					console.log("refferblock success");
					var txlist = [];
					
					body.transactions.forEach(function (transaction) {
						txlist.push([transaction.txid, transaction.payload]);
					});
		 	        					
					res.render('refferBlock', {
		
						title: 'BlockInfomation',
						stateHash: body.stateHash,
						previousBlockHash:body.previousBlockHash,
						txlist:txlist,
					});
				}
			}
		});
	}
});

module.exports = router;