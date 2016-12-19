$(document).ready(function() {
	$(".page-link").click(function(){
		var pagetype = $(this).attr('data-page-type');
		var id = $(this).attr('data-page-name');
		console.log("Generating " + pagetype + " page" + id);

		switch (pagetype) {
			case "User":
				var payload = {user_id: id};
				var query = $.param(payload);
				$.ajax({
					type: "GET",
					url: "/user-page",
					data: payload, 
					success: function(result){
					}
				});
				location.href = "/user-page?" + query;
				break;

			case "Artist":
				var payload = {artist_id: id};
				var query = $.param(payload);
				console.log(query);
				$.ajax({
					type: "GET",
					url: "/artist-page",
					data: payload, 
					success: function(result){
					}
				});
				location.href = "/artist-page?" + query;
				break;

			case "Release":
				var payload = {release_id: id};
				var query = $.param(payload);
				$.ajax({
					type: "GET",
					url: "/release-page",
					data: payload, 
					success:function(result){
					}
				});
				location.href = "/release-page?" + query;
				break;

			case "Track":
				var payload = {track_id: id};
				var query = $.param(payload);
				console.log("asdasd");
				$.ajax({
					type: "GET",
					url: "/track-page",
					data: payload, 
					success:function(result){
					}
				});
				location.href = "/track-page?" + query;
				break;

			case "Tag":
				var payload = {tag_name: id};
				// alert(payload);
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
});

