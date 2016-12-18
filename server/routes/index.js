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
	db.query("SELECT DISTINCT * FROM artist WHERE artistname LIKE ? ORDER BY CASE WHEN artistname LIKE ? THEN 0 WHEN artistname LIKE ? THEN 1 WHEN artistname LIKE ? THEN 2 ELSE 3 END", ["%"+search_val+"%", search_val, search_val+"%", "%"+search_val], function(err, rows){
		if(err) throw err;
		// Reorder/select displayed rows. Map each chosen db column to a display name in order.
		console.log(rows[0].artistname)
		var columns = {
			db: ['artistname', 'artistlocation'],
			display: ['Artist', 'Locality'],
		}
		var data = rows.map(function(obj){
			return splitFields(obj, columns);
		});
		res.render('results', { title: 'search by artist', category: 'Artists', query: search_val, results: data});
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
	db.query("SELECT DISTINCT * FROM track WHERE title LIKE ? ORDER BY CASE WHEN title LIKE ? THEN 0 WHEN title LIKE ? THEN 1 WHEN title LIKE ? THEN 2 ELSE 3 END", ["%"+search_val+"%", search_val, search_val+"%", "%"+search_val], function(err, rows, fields){
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
