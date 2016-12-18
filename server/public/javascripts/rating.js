
$(document).ready(function(){

	$('.ratings_stars').hover(
		function(){
			if($(this).parent().attr('id') == 'user_rating'){
				$(this).prevAll().addClass('ratings_over');
				$(this).addClass('ratings_over');
				$(this).nextAll().removeClass('ratings_vote');
			}
		},
		function(){
			if($(this).parent().attr('id') == 'user_rating'){
				$(this).prevAll().removeClass('ratings_over');
				$(this).removeClass('ratings_over');
				set_votes($(this).parent());
			}
		}

		);

	$('.track-click').click(function(){
		var track_name = $(this).text();
		$('#rate-title').text(track_name);


		$('.rate_widget').each(function(){
			var widget = this;
			if($(widget).attr('id') == 'avg_rating'){
				$.ajax({
					type: 'POST',
					url: '/ratings/get_rating',
					data: { type: 'avg', trackname: track_name},
					success: function(result){
						console.log(result);
						$(widget).data('fsr',result);
						set_votes(widget);
					}
				});
			}
			else{
				$.ajax({
					type: 'POST',
					url: '/ratings/get_rating',
					data: { type: 'user', trackname: track_name, uid: Cookies.get('uid')},
					success: function(result){
						console.log(result);
						$('#comment').val(result.comment);
						if(typeof $(widget).data('fsr') !== 'undefined'){
							$(widget).data('fsr').rating = result.rating;
							//console.log($(widget).data('fsr').rating);
						}	
						else{
							$(widget).data('fsr',result);
						}
						set_votes(widget);
					}
				});

			}

		});
	});


	$('.ratings_stars').click(function(){
		var widget = $(this).parent();
		var rating = Number($(this).attr('class').split(' ')[0].split('_')[1]);
		var INFO = $(this).parent().data('fsr');

		if(widget.attr('id') == 'user_rating'){
			INFO['trating'] = rating;
			$(widget).data('fsr',INFO);
			set_votes(widget);
		}

	});

	$('#btn-comment').click(function(){
		var rating = $('#user_rating').data('fsr').trating;
		var comment = $('#comment').val();
		var uid = Cookies.get('uid');
		var tname = $('#rate-title').text();
		console.log('clicked' + tname+ uid);
		$.ajax({
			type: 'POST',
			url: '/ratings/update_rating',
			data: { uid: uid, trackname: tname, rate: rating, review: comment},
			success: function(result){
				//console.log(result);
				// do something
			}
		});
		$('#close-rate').click();
		$('#comment').val('');

	});

	$('.modal').on('hidden.bs.modal', function(){
		$('#comment').val('');
	});


	function set_votes(widget){
		if($(widget).attr('id') == 'avg_rating'){

			var avg = Math.floor($(widget).data('fsr').trating);
		}
		else{
			var avg = $(widget).data('fsr').rating;
		} 
		//console.log(avg);

		if(avg == 0){
			console.log('reset');
			$(widget).find('.star_1').nextAll().removeClass('ratings_vote');
			$(widget).find('.star_1').removeClass('ratings_vote');
		}
		else{
			$(widget).find('.star_' + avg).prevAll().addClass('ratings_vote');
			$(widget).find('.star_' + avg).addClass('ratings_vote');
			$(widget).find('.star_' + avg).nextAll().removeClass('ratings_vote');
		}

		if($(widget).attr('id') == 'avg_rating'){
			var votes = $(widget).data('fsr').num_votes;
			var exact = $(widget).data('fsr').trating.toFixed(1);

			$(widget).find('.total_votes').text(votes + ' votes recorded ('+ exact + ' rating)');
		}
	}
});

