$(document).ready(function(){
	console.log("Global scripts loaded");

	// Bind backspace key to back
	// $(document).keyup(function(e) {
		// if (e.keyCode == 8)
			// window.history.back();
	// });

	$('.navbar-brand').click(function(){
		location.href = '/';
	});

	// Remove login prompt if signed in
	if (Cookies.get('user')) {
		console.log(Cookies.get('user') + " cookie found");
		$("#current-user").text(Cookies.get('user'));
		$(".logout-text").removeClass("hidden");
		$(".login-text").addClass("hidden");
		$("#rate").removeClass("hidden");
	}
	else {
		console.log("No cookie found")
		$("#rate").addClass("hidden");
		$(".login-text").removeClass("hidden");
		$(".logout-text").addClass("hidden");
	}

	// Logout
	$("#logout").click(function(){
		Cookies.remove('user');
		$("#rate").addClass("hidden");
		$(".logout-text").addClass("hidden");
		$(".login-text").removeClass("hidden");
		location.href = "/";
	});


});

