
$(document).ready(function(){
	console.log("ready!");

	if(Cookies.get('user')){
		console.log(Cookies.get('user'));
		$("#current-user").text(Cookies.get('user'));
		$(".logout-text").removeClass("hidden");
		$(".login-text").addClass("hidden");
	}
	else{
		$(".login-text").removeClass("hidden");
		$(".logout-text").addClass("hidden");
		console.log("no user");
	}


	$("#logout").click(function(){
		Cookies.remove('user');
		$(".logout-text").addClass("hidden");
		$(".login-text").removeClass("hidden");
		location.href = "/";
	});


});

