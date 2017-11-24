var express = require('express');
var router = express.Router();
var request = require("request");
var async = require('async');

router.get('/', function(req, res, next) {

	user = req.session.user_id;

	var blocks = [];
	var history = [];
   		

    if (!req.session.user_id) { 
		res.redirect('/login');
    }else{

    async.waterfall([
    	  function(callback) {
    			console.log("最新ブロック高を取得");
    			var get_blockhight_json = {
    					url : global.vp0 + "/chain",
    					headers : {
    						"Content-type" : "application/json",
    					}
    			};
    			request.get(get_blockhight_json,function(error, response, body) {
    				var toObj = JSON.parse(body);
    				height = toObj.height - 1;
    				console.log("height :" + height);
    						
    				for(i = 200 ; i <= height; i++){
    					console.log(i);
    					blocks.push(i);
    				}
    				callback(null, blocks);
    			});
    	  },
    	  function(blocks, callback) {
       		  console.log("BLOCK情報を取得");

       		  async.each(blocks, function(key, callback){
       			  var tran = [];

       			  request_url = global.vp0 + "/chain/blocks/" + key;
       			  request.get(request_url, function(error, response, body) {
	  					var toObj = JSON.parse(body);
	  					
		       			if(typeof toObj.transactions != 'undefined'){
		       				
		       				toObj.transactions.forEach(function (transaction) {
 	        					console.log("------" + key);

		       					payload = transaction['payload'];

		         				var buffer = new Buffer(payload, 'base64');
		         				var ascii = buffer.toString('ascii');

		         				console.log("ascii :" + ascii);

	 	        				ascii.split('\n').forEach(function (line) {
	 	        					console.log("->" + line);
			  	       				tran.push(line.substr(1));
	 	        				});

	 	        				console.log("tran :"+ tran);
	 	        				if(tran[2] == "transfer" && (tran[3] == user || tran[4] == user)){
	 	        					tran.shift();
	 	        					tran.shift();
	 	        					tran.shift();
	 	        					tran.unshift(key);
	 	        					history.push(tran);
	 	        					tran = [];
	 	        				}

 	        					console.log("+++++++" + key);

		       				});

		  	       			}
			  				callback();

		  				});

   					},function(err){
   						callback(null, history);
   					});
    	  }
    		], function(err, history) {
    		  if (err) {
    		    throw err;
    		  }
   			  console.log('history done.');

			    history.sort(function(a,b){

			    	  var aa = a[0];
			    	  var bb = b[0];
			    	  if(aa < bb){return -1;}
			    	  if(aa > bb){return 1;}
			    	  return 0;
			    	});

			    console.log("hist :"+ history);

			    if (user) {
					res.render('history', {
						title: '履歴',
						history: history
					});	
				}else{
					res.redirect('/login');
				}
 
    	});
    }
});

module.exports = router;
