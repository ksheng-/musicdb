$(document).ready(function(){
	console.log("ready!");

		$("#btn-login").click(function(){
			var username = $("#username").val();
			var password = $("#password").val();

			$("#form-username-login").removeClass("has-error");
			$("#form-password-login").removeClass("has-error");
			$("#err-user").addClass("hidden");
			$("#err-missing").addClass("hidden");

			console.log(username);
			$.ajax({
				type: "POST",
				url: "/users/login",
				data: {username: username, password: password},
				success: function(response){
					$("#form-username-login").removeClass("has-error");
					$("#form-password-login").removeClass("has-error");
					$("#err-user").addClass("hidden");
					$("#err-missing").addClass("hidden");
					Cookies.set('user', response['username']);
					Cookies.set('uid', response['uid']);
					console.log(Cookies.get().user);
					location.reload();
				},
				error: function (xhr, ajaxOptions, thrownError){
					switch (xhr.status) {
						case 400:
							$("#form-username-login").addClass("has-error");
							$("#form-password-login").addClass("has-error");
							$("#err-missing").removeClass("hidden");
							console.log('Missing field');
							break;
						case 403:
							$("#form-username-login").addClass("has-error");
							$("#form-password-login").addClass("has-error");
							$("#err-user").removeClass("hidden");
							console.log('Username or password incorrect');
							break;
					}
				} 
			});

		});

		$('#username').keyup(function(e){
			if(e.keyCode == 13)
				$("#btn-login").click();
		});

		$('#password').keyup(function(e){
			if(e.keyCode == 13)
				$("#btn-login").click();
		});

});

