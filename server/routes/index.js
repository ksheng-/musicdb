var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'musicdb' });
	//res.send("test")
});

router.get('/artist-search', function(req, res, next) {
	// Search for all rows that contain query
	var search_val = req.query["artist_name"];
	console.log(search_val);
	// Query and sort by relevance
	db.query("SELECT DISTINCT * FROM artist WHERE artistname LIKE ? ORDER BY CASE WHEN artistname LIKE ? THEN 0 WHEN artistname LIKE ? THEN 1 WHEN artistname LIKE ? THEN 2 ELSE 3 END", ["%"+search_val+"%", search_val, search_val+"%", "%"+search_val], function(err, rows, fields){
		if(err) throw err;
		// Reorder/select displayed rows
		var fields = {}
		var results = {}
		res.render('results', { title: 'search by artist', category: 'Artists', query: search_val, results: rows});
		//res.send(rows);
	});	
});

router.get('/album-search', function(req, res, next) {
	var search_val = req.query["album_name"];
	console.log(search_val);
	db.query("SELECT DISTINCT * FROM album WHERE albumname LIKE ? ORDER BY CASE WHEN albumname LIKE ? THEN 0 WHEN albumname LIKE ? THEN 1 WHEN albumname LIKE ? THEN 2 ELSE 3 END", ["%"+search_val+"%", search_val, search_val+"%", "%"+search_val], function(err, rows, fields){
		if(err) throw err;
		//console.log(req.body.artist_name);
		res.render('results', { title: 'search by album', category: 'Album', query: search_val, results: rows});
		// res.send(rows[0].artistname);
	});	
});

router.get('/track-search', function(req, res, next) {
	var search_val = req.query["track_name"];
	console.log(search_val);	
	db.query("SELECT DISTINCT * FROM track WHERE trackname LIKE ? ORDER BY CASE WHEN trackname LIKE ? THEN 0 WHEN trackname LIKE ? THEN 1 WHEN trackname LIKE ? THEN 2 ELSE 3 END", ["%"+search_val+"%", search_val, search_val+"%", "%"+search_val], function(err, rows, fields){
		if(err) throw err;
		//console.log(req.body.artist_name);
		res.render('results', { title: 'search by track', category: 'Track', query: search_val, results: rows});
		// res.send(rows[0].artistname);
	});	

});


router.get('/tag-search', function(req, res, next) {
	var search_val = req.query["tag_name"];
	console.log(search_val);
	db.query("SELECT DISTINCT * FROM tags WHERE tag = ? LIMIT 10", [search_val], function(err, rows, fields){
		if(err) throw err;
		//console.log(req.body.artist_name);
		res.render('results', { title: 'search by tag', category: 'Tag', query: search_val, results: rows});
		// res.send(rows[0].artistname);
	});	

});


module.exports = router;
