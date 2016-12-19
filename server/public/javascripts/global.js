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
		$(".current-user").text(Cookies.get('user'));
		$(".current-user").removeClass("hidden");
		$('#alert').addClass('hidden');
		$(".logout-text").removeClass("hidden");
		$(".login-text").addClass("hidden");
		$("#rate").removeClass("hidden");
	}
	else {
		console.log("No cookie found")
		$("#rate").addClass("hidden");
		$('#alert').removeClass('hidden');
		$(".login-text").removeClass("hidden");
		$(".logout-text").addClass("hidden");
	}

	// Logout
	$("#logout").click(function(){
		Cookies.remove('user');
		Cookies.remove('uid');
		$('#alert').removeClass('hidden');
		$("#rate").addClass("hidden");
		$(".logout-text").addClass("hidden");
		$(".login-text").removeClass("hidden");
		location.reload();
	});


	// $('.track-click').click(function(){
		// var track_name = $(this).text();
		// $('#rate-title').text(track_name);
		// Cookies.set('track',track_name);
	// });
});

