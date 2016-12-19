$(document).ready(function(){

	if(Cookies.get('user')){
		$.ajax({
			type: "POST",
			url: "/recommendation/get-recommendation",
			data: {type: 'user',uid: Cookies.get('uid')},
			success: function(response){
				console.log(response);
				if(response.length >0){
					$('#track1').text(response[0].tname);
					$('#rate1').text(response[0].trating.toFixed(1));
				}
				if(response.length > 1){
					$('#track2').text(response[1].tname);
					$('#rate2').text(response[1].trating.toFixed(1));
				}
				if(response.length > 2){
					$('#track3').text(response[2].tname);
					$('#rate3').text(response[2].trating.toFixed(1));
				}

			}
		});


	}
	else{
		// console.log('no user');
		$.ajax({
			type: "POST",
		url: "/recommendation/get-recommendation",
		data: {type: 'guest'},
		success: function(response){
			console.log(response);
			$('#track1').text(response[0].tname);
			$('#rate1').text(response[0].trating.toFixed(1));
			$('#track2').text(response[1].tname);
			$('#rate2').text(response[1].trating.toFixed(1));
			$('#track3').text(response[2].tname);
			$('#rate3').text(response[2].trating.toFixed(1));

		}
		});
	}



});

