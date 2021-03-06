$(document).ready(function(){
	console.log("ready!");

	$("#btn-signup").click(function(){
		var username = $("#new-username").val();
		var password = $("#new-password").val();
		var cpassword = $("#confirm-password").val();
		var alnum = /^[A-Za-z0-9]+$/;

		$("#form-username").removeClass("has-error");
		$("#form-username").removeClass("has-success");
		$("#form-username > .glyphicon-remove").addClass("hidden");
		$("#form-username > .glyphicon-ok").addClass("hidden");
		$("#form-password").removeClass("has-error");
		$("#form-password").removeClass("has-success");
		$("#form-password > .glyphicon-remove").addClass("hidden");
		$("#form-password > .glyphicon-ok").addClass("hidden");
		$("#form-cpassword").removeClass("has-error");
		$("#form-cpassword").removeClass("has-success");
		$("#form-cpassword > .glyphicon-remove").addClass("hidden");
		$("#form-cpassword > .glyphicon-ok").addClass("hidden");
		$("#err-length").addClass("hidden");
		$("#err-match").addClass("hidden");
		$("#err-alnum").addClass("hidden");
		$("#err-taken").addClass("hidden");
		
		if (password.length <= 0 || password.length > 16){
			$("#form-password").addClass("has-error");
			$("#form-password > .glyphicon-remove").removeClass("hidden");
			$("#err-length").removeClass("hidden");
			return;
		}
		else{
			$("#form-password").removeClass("has-error");
			$("#form-password").addClass("has-success");
			$("#form-password > .glyphicon-remove").addClass("hidden");
			$("#form-password > .glyphicon-ok").removeClass("hidden");
			$("#err-length").addClass("hidden");
		}
	
		if (password != cpassword){
			$("#form-cpassword").addClass("has-error")
			$("#form-cpassword > .glyphicon-remove").removeClass("hidden");
			$("#err-match").removeClass("hidden");
			return;
		}
		else{
			$("#form-cpassword").removeClass("has-error");
			$("#form-cpassword").addClass("has-success");
			$("#form-cpassword > .glyphicon-remove").addClass("hidden");
			$("#form-cpassword > .glyphicon-ok").removeClass("hidden");
			$("#err-match").addClass("hidden");
		}
		
		if (!alnum.test(username)){
			$("#form-username").addClass("has-error")
			$("#form-username > .glyphicon-remove").removeClass("hidden");
			$("#err-alnum").removeClass("hidden");
			return;
		}
		else{
			$("#form-username").removeClass("has-error");
			$("#form-username").addClass("has-success");
			$("#form-username > .glyphicon-remove").addClass("hidden");
			$("#form-username > .glyphicon-ok").removeClass("hidden");
			$("#err-alnum").addClass("hidden");
		}
		
		// console.log(username);
		$.ajax({
			type: "POST",
			url: "/users/signup",
			data: {username: username, password: password},
			success: function(response){
				location.reload();
			},
			error: function (xhr, ajaxOptions, thrownError){
				switch (xhr.status) {
					case 400:
						console.log('Missing field');
						break;
					case 403:
						$("#form-username").removeClass("has-success");
						$("#form-username > .glyphicon-ok").addClass("hidden");
						$("#form-username").addClass("has-error");
						$("#form-username > .glyphicon-remove").removeClass("hidden");
						$("#err-taken").removeClass("hidden");
						console.log('Username exists');
						break;
				}
			} 
		});
	
				
	});

	$('#new-username').keyup(function(e){
		if(e.keyCode == 13)
		$("#btn-signup").click();
	});

	$('#new-password').keyup(function(e){
		if(e.keyCode == 13)
		$("#btn-signup").click();
	});

	$('#confirm-password').keyup(function(e){
		if(e.keyCode == 13)
		$("#btn-signup").click();
	});


});

