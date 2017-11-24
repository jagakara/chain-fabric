// ui_table.js ブラウザUI用 JavaScript (index.htmlより呼ばれる)

/*eslint-env jquery */
$(function() {
	$("#Transfer").click(function(e) {
		e.preventDefault(); // エラー

		var args =[$("#item4").val() || "",$("#item1").val() || "",$("#item3").val() || ""];
		var param = {};
		param.item1 = $("#item1").val() || ""; // 入力された文字の取得
		param.item2 = "invoke"; //method type
		param.item3 = args; //args

		$.ajax({
			type : "POST",
			data : JSON.stringify(param),
			contentType : "application/json",
			url : "/",
			success : function(data) {
				alert("add success: " + data);
				showTable(data);
			},
			error : function(data) {
				alert("add failed: " + data);
			}
		});
	});

	// サーバから取得したデータを、htmlテーブルに追加
	var showTable = function(data) {

		//jsonデータをparseしてオブジェクトとして扱えるようにする

		var result = JSON.parse(data);

		$("#tableItems").append("<tr></tr>").find("tr:last").append(

		"<td>" + result.status + "</td>").append(
				"<td>" + result.message + "</td>")
	};
});

/*
$(function() {
	// 追加ボタン（index.htmlのid=add）押下時 実行
	$("#add").click(function(e) {
		e.preventDefault(); // エラー
		var param = {};
		param.item1 = $("#item1").val() || ""; // 入力された文字の取得

		// POSTでのajaxコールで、サーバーのapp.jsのapp.post呼び出し
		$.ajax({
			type : 'POST',
			data : JSON.stringify(param),
			contentType : 'application/json',
			url : '/',
			success : function(data) {
				console.log('add success: ' + JSON.stringify(data));
				showTable(data);
			},
			error : function(data) {
				console.log('error ' + JSON.stringify(data));
			}
		});

		// 入力項目名を空白に
		$("#item1").val('');
	}); // #add

	// サーバから取得したデータを、htmlテーブルに追加
	var showTable = function(data) {
		$("#tableItems").append("<tr></tr>").find("tr:last").append(
				"<td>" + data.date + "</td>").append(
				"<td>" + data.item1 + "</td>")
	};
});
*/

/*
invokeのパラメータ
{
"jsonrpc": "2.0",
"method": "invoke",
"params": {
  "type": 1,
  "chaincodeID": {
    "name": "59d5075e7146d8df37bdcb0c289c293c66ee2a56c0f8d833410ff7cd8d3dd6c65ff0c6966c1914109ed7e04423bc73967b7c693fbeb383bb1a057c75b37e2674"
  },
  "ctorMsg": {
    "function": "invoke",
    "args": [
      "a","b","4"
    ]
  },
  "secureContext": "user_type1_0"
},
"id": 0
}
*/