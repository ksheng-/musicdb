$(document).ready(function() {

	$(".category-button").val("Artists");
	$("#search").val("");

	$(".category").click(function(){
		console.log("category selected");
		$(".category-button").val($(this).text());
		$(".category-button").text($(this).text());
	});



	// $("#back").click(function(){
		// console.log('back');
		// location.href = '/';
	// });

	$("#btn-search").click(function(){
		var search_val = $("#search").val();
		var category = $(".category-button").val();
		console.log("Searched " + category + " for " + search_val);

		// if(search_val == "")
			// $(".input-group").addClass("has-error");
		// return;
		switch (category) {
			case "Artists":
				var payload = {artist_name: search_val};
				var query = $.param(payload);
				$.ajax({
					type: "GET",
					url: "/artist-search",
					data: payload, 
					success: function(result){
					}
				});
				location.href = "/artist-search?" + query;
				break;

			case "Albums":
				var payload = {album_name: search_val};
				var query = $.param(payload);
				$.ajax({
					type: "GET",
					url: "/album-search",
					data: payload, 
					success:function(result){
					}
				});
				location.href = "/album-search?" + query;
				break;

			case "Tracks":
				var payload = {track_name: search_val};
				var query = $.param(payload);
				$.ajax({
					type: "GET",
					url: "/track-search",
					data: payload, 
					success:function(result){
					}
				});
				location.href = "/track-search?" + query;
				break;

			case "Tags":
				var payload = {tag_name: search_val};
				var query = $.param(payload);
				$.ajax({
					type: "GET",
					url: "/tag-search",
					data: payload, 
					success:function(result){
					}
				});
				location.href = "/tag-search?" + query;
				break;
		}
	});


	//Enter key searching
	$('#search').keyup(function(e){
		if(e.keyCode == 13){
			$("#btn-search").click();
		}
	});



});

