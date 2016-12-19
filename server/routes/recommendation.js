var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/get-recommendation', function(req,res,next){

	if (req.body.type == 'guest'){

	var query_string = "SELECT tname,trating FROM Tracks ORDER BY trating DESC LIMIT 1000";

	db.query(query_string, function(err,rows,fields){
		if (err) throw err;
		var rng1 = Math.floor((Math.random()*333) + 0);
		var rng2 = Math.floor((Math.random()*333) + 333);
		var rng3 = Math.floor((Math.random()*333) + 666);
		//console.log([rows[rng1],rows[rng2],rows[rng3]]);

		res.send([rows[rng1],rows[rng2],rows[rng3]]);
	});
	}
	else{
		var uid=req.body.uid;
		var query_string = "SELECT tid FROM rates_track ORDER BY rating DESC LIMIT 1";

		db.query(query_string, function(err,rows,fields){
			if (err) throw err;
			if(rows.length > 0){

				var query_string = "SELECT Track_tags.tags FROM Track_tags, Tracks WHERE Tracks.tid = ? AND Tracks.SongID_MSS=Track_tags.songid"
			db.query(query_string,[rows[0].tid], function(err,rows,fields){
				if (err) throw err;
				if(rows.length > 0){
					var tag = rows[Math.floor((Math.random()*(rows.length-1)) + 0)].tags;
					var query_string = "SELECT Tracks.tname,Tracks.trating FROM Tracks, Track_tags WHERE Track_tags.tags=? AND Track_tags.songid=Tracks.SongID_MSS LIMIT 100";

					db.query(query_string,[tag], function(err,rows,fields){
						if(rows.length > 3){
							var length = rows.length/3;
							var rng1 = Math.floor((Math.random()*length) + length);
							var rng2 = Math.floor((Math.random()*length) + 2*length);
							var rng3 = Math.floor((Math.random()*length) + 3*length);
							//console.log([rows[rng1],rows[rng2],rows[rng3]]);

							res.send([rows[rng1],rows[rng2],rows[rng3]]);

						}
						else{
							res.send(rows);
						}
					});


				}
				else{
					var query_string = "SELECT tname,trating FROM Tracks ORDER BY trating DESC LIMIT 1000";

					db.query(query_string, function(err,rows,fields){
						if (err) throw err;
						var rng1 = Math.floor((Math.random()*333) + 0);
						var rng2 = Math.floor((Math.random()*333) + 333);
						var rng3 = Math.floor((Math.random()*333) + 666);
						//console.log([rows[rng1],rows[rng2],rows[rng3]]);

						res.send([rows[rng1],rows[rng2],rows[rng3]]);
					});

				}


			});
			}
			else{
				var query_string = "SELECT tname,trating FROM Tracks ORDER BY trating DESC LIMIT 1000";

				db.query(query_string, function(err,rows,fields){
					if (err) throw err;
					var rng1 = Math.floor((Math.random()*333) + 0);
					var rng2 = Math.floor((Math.random()*333) + 333);
					var rng3 = Math.floor((Math.random()*333) + 666);
					//console.log([rows[rng1],rows[rng2],rows[rng3]]);

					res.send([rows[rng1],rows[rng2],rows[rng3]]);
				});

			}
		});

	}

});




module.exports = router;
