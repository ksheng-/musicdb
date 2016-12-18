
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

	$('.rate_widget').each(function(){
		var widget = this;
		if($(widget).attr('id') == 'avg_rating'){
			$.ajax({
				type: 'POST',
				url: '/ratings/get_rating',
				data: { type: 'avg', trackid: ''},
				success: function(result){
					$(widget).data('fsr',result);
					set_votes(widget);
				}
			});
		}
		else{
			$.ajax({
				type: 'POST',
				url: '/ratings/get_rating',
				data: { type: 'user', trackid: ''},
				success: function(result){
					$(widget).data('fsr',result);
					set_votes(widget);
				}
			});

		}

	});


	$('.ratings_stars').click(function(){
		var widget = $(this).parent();
		var rating = Number($(this).attr('class').split(' ')[0].split('_')[1]);
		var INFO = $(this).parent().data('fsr');

		if(widget.attr('id') == 'user_rating'){
			INFO['whole_avg'] = rating;
			$(widget).data('fsr',INFO);
			set_votes(widget);
		}

	});

	$('#btn-comment').click(function(){
		var rating = $('#user_rating').data('fsr').whole_avg;
		var comment = $('#comment').text();
		console.log('clicked');
		$.ajax({
				type: 'POST',
				url: '/ratings/update_rating',
				data: { uid: '', trackid: '', rate: rating, review: comment},
				success: function(result){
					console.log(result);
					// do something
				}
			});
		$('#close-rate').click();

	});


	function set_votes(widget){
		var avg = $(widget).data('fsr').whole_avg;

		$(widget).find('.star_' + avg).prevAll().addClass('ratings_vote');
		$(widget).find('.star_' + avg).addClass('ratings_vote');
		$(widget).find('.star_' + avg).nextAll().removeClass('ratings_vote');
		if($(widget).attr('id') == 'avg_rating'){
			var votes = $(widget).data('fsr').number_votes;
			var exact = $(widget).data('fsr').dec_avg;

			$(widget).find('.total_votes').text(votes + ' votes recorded ('+ exact + ' rating)');
		}
	}
});

