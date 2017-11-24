/*eslint-env jquery */
$(function() {
	$("#Login").click(function(e) {
		e.preventDefault(); // エラー

		var args = [$("#user_id").val() || ""];
		var args = [$("#password").val() || ""];
		var param = {};
		param.item1 = $("#user_id").val() || ""; // 入力された文字の取得
		param.item2 = $("#password").val() || ""; // 入力された文字の取得
		param.item3 = "registrar"; //method type

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

	//ログインIDをセッション領域に保存？？(app.jsにて記述するかは渡辺くんと相談）
	//ログイン成功の場合次画面に遷移
	//ログイン失敗の場合エラーメッセージを画面に返却

});

