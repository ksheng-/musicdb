var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'musicdb' });
	//res.send("test")
});

router.get('/artist-search', function(req, res, next) {
	var search_val = req.query["artist_name"] + "%";
	console.log(search_val);
	db.query("SELECT DISTINCT * FROM artist WHERE artistname LIKE ?",[search_val], function(err, rows, fields){
				if(err) throw err;
				res.render('results', { title: 'search by artist', category: 'Artists', artist_results: rows});
				//res.send(rows);
			});	
});

router.get('/album-search', function(req, res, next) {
	var search_val = req.query["album_name"] + '%';
	console.log(search_val);
	db.query("SELECT DISTINCT * FROM album WHERE albumname LIKE ?",[search_val], function(err, rows, fields){
		if(err) throw err;
		//console.log(req.body.artist_name);
		res.render('results', { title: 'search by album', category: 'Album', album_results: rows});
		// res.send(rows[0].artistname);
	});	
});

router.get('/track-search', function(req, res, next) {
	var search_val = req.query["track_name"] + "%";
	console.log(search_val);
	db.query("SELECT DISTINCT * FROM track WHERE title LIKE ?",[search_val], function(err, rows, fields){
		if(err) throw err;
		//console.log(req.body.artist_name);
		res.render('results', { title: 'search by track', category: 'Track', track_results: rows});
		// res.send(rows[0].artistname);
	});	

});


router.get('/tag-search', function(req, res, next) {
	var search_val = req.query["tag_name"];
	console.log(search_val);
	db.query("SELECT DISTINCT * FROM tags WHERE tag = ? LIMIT 10",[search_val], function(err, rows, fields){
		if(err) throw err;
		//console.log(req.body.artist_name);
		res.render('results', { title: 'search by tag', category: 'Tag', tag_results: rows});
		// res.send(rows[0].artistname);
	});	

});


module.exports = router;
