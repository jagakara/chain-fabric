var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('refferCurrentBlock',{
		title: 'UseAPI'
	});
});

router.post('/', function(req, res, next) {

	var request = require("request");

	/* requestURL */
	var options = "";
	if(req.body.recvid = "peer1"){
		options = global.vp0 + "/chain";
	}else if(req.body.recvid = "peer2"){
		options = global.vp1 + "/chain";		
	}else if(req.body.recvid = "peer3"){
		options = global.vp2 + "/chain";				
	}else if(req.body.recvid = "peer4"){
		options = global.vp3 + "/chain";		
	}else{
		options = global.vp0 + "/chain";
	}

	request.get(options, function(error, response, body) {
		body = JSON.parse(body);
		console.log(body);

		res.render('refferCurrentBlock', {
			title: 'BlockInfomation',
			height: body.height,
			currentBlockHash: body.currentBlockHash,
			previousBlockHash:body.previousBlockHash
		});
	});

});

module.exports = router;