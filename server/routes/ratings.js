var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET users listing. */
router.get('/', function(req,res,next){
	res.send('hello');
});

router.post('/get_rating', function(req, res, next) {
	if(req.body.type == 'avg'){
		var query_string = 'SELECT num_votes,trating FROM Tracks WHERE tname=?';
		console.log(req.body.trackname);
		db.query(query_string, [req.body.trackname], function(err,rows,fields){
			if (err) throw err;
			if(rows.length > 0){
				//console.log(rows[0]);
				res.status(200).send(rows[0]);
			}
		});

	}
	else{
		var query_string = 'SELECT rates_track.rating, rates_track.comment FROM rates_track, Tracks WHERE (Tracks.tname=? AND rates_track.uid=?) AND Tracks.tid=rates_track.tid';
console.log(req.body.trackname, req.body.uid);

		db.query(query_string, [req.body.trackname, req.body.uid], function(err,rows,fields){
			if (err) throw err;
			if(rows.length > 0){
				//console.log(rows[0]);
				res.status(200).send(rows[0]);
			}
			else{
				res.send({'rating': 0});
			}
		});
	}
});

router.post('/update_rating', function(req, res, next) {
	var rating = req.body.rate;
	var comment = req.body.review;
	var uid = req.body.uid;
	var trackname = req.body.trackname;

	var query_string = 'SELECT * FROM rates_track, Tracks WHERE (Tracks.tname=? AND rates_track.uid=?) AND Tracks.tid=rates_track.tid';
	db.query(query_string, [trackname, uid], function(err,rows,fields){
		if (err) throw err;

		// rating already exists
		if(rows.length > 0){
			console.log('change rating');
			var query_string = 'UPDATE rates_track set rating=? ,comment=? WHERE tid=? AND uid=?';
			db.query(query_string, [rating, comment, rows[0]['tid'], uid], function(err){
				if (err) throw err;

			});
		}

		// new rating record
		else{

			console.log('new record');
			var query_string = 'SELECT tid FROM Tracks WHERE tname=?';
			db.query(query_string, [trackname], function(err,rows,fields){
				if (err) throw err;

				var query_string = "INSERT INTO rates_track(uid,tid,rating, comment) VALUES (?, ?, ?, ?)";
				db.query(query_string, [uid,rows[0]['tid'],rating,comment], function(err){
					if (err) throw err;
					// update num_votes
					else{
						var query_string = 'UPDATE Tracks SET num_votes = num_votes + 1 WHERE tid=?';
						db.query(query_string, [rows[0]['tid']], function(err){
							if (err) throw err;
						});
					}
				});

			});
		}
	});

	// update database
	var query_string = 'UPDATE Tracks A INNER JOIN (SELECT AVG(rates_track.rating) r, rates_track.tid t  FROM rates_track, Tracks WHERE Tracks.tname=? AND Tracks.tid=rates_track.tid) B ON A.tid= B.t SET A.trating=B.r';
	db.query(query_string, [trackname], function(err,rows,fields){
		if (err) throw err;

	});

	res.send('success');

});



module.exports = router;
