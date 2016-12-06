
$(document).ready(function(){
	console.log("ready!");

		$("#btn-login").click(function(){
			var username = $("#username").val();
			var password = $("#password").val();
			console.log(username);
			$.ajax({
				type: "POST",
				url: "/users/login",
				data: {username: username, password: password},
				success: function(result){
					if (result == 0){

					}
					else{
						Cookies.set('user',result);
						console.log(Cookies.get().user);
						location.reload();
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

