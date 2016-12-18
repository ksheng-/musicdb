var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'MUSICDB' });
	//res.send("test")
});

router.get('/artist-search', function(req, res, next) {
	// Search for all rows that contain query
	var search_val = req.query["artist_name"];
	if(search_val == ''){
		res.render('results', { title: 'search by artist', category: 'Artists', query: search_val, results: ''});
	}
	else{
		console.log(search_val);
		// Query and sort by relevance
		db.query("SELECT a.aid a.name, a.type, a.locality, a.arating, GROUP_CONCAT(t.tagname ORDER BY t.aid) AS tags FROM Artists a LEFT JOIN tagged t ON a.aid = t.aid GROUP BY a.name HAVING a.name LIKE ? ORDER BY CASE WHEN a.name LIKE ? THEN 0 WHEN a.name LIKE ? THEN 1 WHEN a.name LIKE ? THEN 2 ELSE 3 END", ["%"+search_val+"%", search_val, search_val+"%", "%"+search_val], function(err, rows){
			if(err) throw err;
			// Reorder/select displayed rows. Map each chosen db column to a display name in order.
			var columns = {
				db: ['aid', 'name', 'imageurl', 'type', 'locality', 'tags', 'arating'],
				display: ['ArtistID', 'Artist', 'Image', 'Type', 'Locality', 'Tags', 'Rating'],
			}
			var data = rows.map(function(obj){
				return splitFields(obj, columns);
			});
			console.log(data);
			res.render('results', { title: 'search by artist', category: 'Artists', query: search_val, results: data});
		});	
	}
});

router.get('/album-search', function(req, res, next) {
	var search_val = req.query["album_name"];
	if(search_val == ''){
		res.render('results', { title: 'search by release', category: 'Release', query: search_val, results: ''});
	}
	else{

		console.log(search_val);
		// NEED JOIN
		db.query("SELECT DISTINCT * FROM Releases WHERE rname LIKE ? ORDER BY CASE WHEN rname LIKE ? THEN 0 WHEN rname LIKE ? THEN 1 WHEN rname LIKE ? THEN 2 ELSE 3 END", ["%"+search_val+"%", search_val, search_val+"%", "%"+search_val], function(err, rows, fields){
			if(err) throw err;
			var columns = {
				db: ['rname', 'rrating'],
			display: ['Release', 'Rating'],
			}
			var data = rows.map(function(obj){
				return splitFields(obj, columns);
			});
			//console.log(req.body.artist_name);
			res.render('results', { title: 'search by release', category: 'Release', query: search_val, results: data});
			// res.send(rows[0].artistname);
		});	
	}
});

router.get('/track-search', function(req, res, next) {
	var search_val = req.query["track_name"];
	if(search_val == ''){
		res.render('results', { title: 'search by track', category: 'Track', query: search_val, results: ''});
	}
	else{


		console.log(search_val);	
		db.query("SELECT DISTINCT * FROM Tracks WHERE tname LIKE ? ORDER BY CASE WHEN tname LIKE ? THEN 0 WHEN tname LIKE ? THEN 1 WHEN tname LIKE ? THEN 2 ELSE 3 END", ["%"+search_val+"%", search_val, search_val+"%", "%"+search_val], function(err, rows, fields){
			if(err) throw err;
			var columns = {
				db: ['tname', 'duration', 'trating'],
			display: ['Track', 'duration', 'Rating'],
			}
			var data = rows.map(function(obj){
				return splitFields(obj, columns);
			});

			//console.log(req.body.artist_name);
			res.render('results', { title: 'search by track', category: 'Track', query: search_val, results: data});
			// res.send(rows[0].artistname);
		});	
	}

});

router.get('/tag-search', function(req, res, next) {
	var search_val = req.query["tag_name"];
	console.log(search_val);
	db.query("SELECT DISTINCT * FROM Tags WHERE tname = ? LIMIT 10", [search_val], function(err, rows, fields){
		if(err) throw err;
		//console.log(req.body.artist_name);
		res.render('results', { title: 'search by tag', category: 'Tag', query: search_val, results: rows});
		// res.send(rows[0].artistname);
	});	

});

var splitFields = function(entry, fields){
	var newObj = {};
	for (var i = 0; i < fields.db.length; ++i){
		if (entry[fields.db[i]])
			newObj[fields.display[i]] = entry[fields.db[i]];
		else
			newObj[fields.display[i]] = '--';
	}
	return newObj;
}

module.exports = router;
