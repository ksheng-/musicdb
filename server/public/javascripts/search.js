$(document).ready(function(){
	console.log("ready!");

	var category = "Artists";
	$(".category").click(function(){
		console.log("category clicked!");
		category = $(this).text();
		$("#category-button").text(category);
	});

	$("#btn-search").click(function(){
		console.log("asdasdas");
		switch (category) {
			case "Artists":
				console.log(category + " search request");
				$.ajax({type: "GET",
					url: "/artist-search",
					success:function(result){
						location.href = "/artist-search";
					}});
				break;
			case "Albums":
				console.log(category + " search request");
				$.ajax({type: "GET",
					url: "/album-search",
					success:function(result){
						location.href = "/album-search";
						// $("#search").val(result);
					}});
				break;
			case "Tracks":
				console.log(category + " search request");
				$.ajax({type: "GET",
					url: "/track-search",
					success:function(result){
						location.href = "/track-search";
						// $("#search").val(result);
					}});
				break;
			case "Tags":
				console.log(category + " search request");
				$.ajax({type: "GET",
					url: "/tag-search",
					success:function(result){
						location.href = "/tage-search";
						// $("#search").val(result);
					}});
				break;
		}
	});
});

