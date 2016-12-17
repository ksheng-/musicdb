$(document).ready(function(){
	var category = $("#category-button").val();

	$(".category").click(function(){
		console.log("category clicked!");
		category = $(this).val();
		//var value = $(this).val();
		$("#category-button").val(category);
		$("#category-button").text($(this).text());
	});

	$('#search').keyup(function(e){
		if(e.keyCode == 13)
		$("#btn-search").click();
	});

	$("#back").click(function(){
		console.log('back');
		location.href = '/';
	});

	$("#btn-search").click(function(){
		var search_val = $("#search").val();
		category = $("#category-button").val();
		console.log(category);
		$("#search").val("");
		if(search_val == "")
		return;
		switch (category) {
			case "1":
				var payload = {
					artist_name: search_val
				};

				var query = $.param(payload);
				location.href = "/artist-search?" + query;
				// $.ajax({type: "GET",
					// url: "/artist-search",
					// data: payload, 
					// success:function(result){
						// location.href = "/artist-search";
					// }});
				break;
			case "2":
				var payload = {
					album_name: search_val
				};

				var query = $.param(payload);
				location.href = "/album-search?" + query;

				break;
			case "3":
				var payload = {
					track_name: search_val
				};

				var query = $.param(payload);
				location.href = "/track-search?" + query;

				break;
			case "4":
				var payload = {
					tag_name: search_val
				};

				var query = $.param(payload);
				location.href = "/tag-search?" + query;

				break;
		}
	});

	$('.navbar-brand').click(function(){
		location.href = '/';
	});

	$('.artist-click').click(function(){
		console.log($(this).text());
		var payload = {
			artist_name: $(this).text() 
		};

		var query = $.param(payload);
		location.href = "/artist-search?" + query;
	});

	$('.album-click').click(function(){
		console.log($(this).text());
		var payload = {
			album_name: $(this).text() 
		};

		var query = $.param(payload);
		location.href = "/album-search?" + query;
	});

});

