/*eslint-env jquery */
$(function() {
	$("#Login").click(function(e) {
		e.preventDefault(); // �G���[

		var args = [$("#user_id").val() || ""];
		var args = [$("#password").val() || ""];
		var param = {};
		param.item1 = $("#user_id").val() || ""; // ���͂��ꂽ�����̎擾
		param.item2 = $("#password").val() || ""; // ���͂��ꂽ�����̎擾
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

	//���O�C��ID���Z�b�V�����̈�ɕۑ��H�H(app.js�ɂċL�q���邩�͓n�ӂ���Ƒ��k�j
	//���O�C�������̏ꍇ����ʂɑJ��
	//���O�C�����s�̏ꍇ�G���[���b�Z�[�W����ʂɕԋp

});

