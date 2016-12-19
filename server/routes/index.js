var express = require('express');
var router = express.Router();
var db = require('../db');
var async = require('async');
/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'musicdb' });
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
		db.query("SELECT a.aid, a.name, a.type, a.locality, a.arating, a.imageurl, GROUP_CONCAT(t.tagname ORDER BY t.aid) AS tags FROM Artists a LEFT JOIN tagged t ON a.aid = t.aid GROUP BY a.name HAVING a.name LIKE ? ORDER BY CASE WHEN a.name LIKE ? THEN 0 WHEN a.name LIKE ? THEN 1 WHEN a.name LIKE ? THEN 2 ELSE 3 END", ["%"+search_val+"%", search_val, search_val+"%", "%"+search_val], function(err, rows){
			if(err) throw err;
			// Reorder/select displayed rows. Map each chosen db column to a display name in order.
			var columns = {
				db: ['aid', 'name', 'imageurl', 'type', 'locality', 'tags', 'arating'],
				display: ['ArtistID', 'Artist', 'Image', 'Type', 'Locality', 'Tags', 'Rating'],
			}
			var data = rows.map(function(obj){
				return splitFields(obj, columns);
			});
			res.render('results', { title: 'search by artist', category: 'Artists', query: search_val, results: data});
		});	
	}
});

router.get('/album-search', function(req, res, next) {
	var search_val = req.query["album_name"];
	if(search_val == ''){
		res.render('results', { title: 'search by release', category: 'Releases', query: search_val, results: ''});
	}
	else{

		console.log(search_val);
		// NEED JOIN
		db.query("SELECT r.rname, a.aid, a.name, r.rrating FROM publishes p INNER JOIN Releases r ON p.rid = r.rid INNER JOIN Artists a ON p.aid = a.aid HAVING r.rname LIKE ? ORDER BY CASE WHEN r.rname LIKE ? THEN 0 WHEN r.rname LIKE ? THEN 1 WHEN r.rname LIKE ? THEN 2 ELSE 3 END", ["%"+search_val+"%", search_val, search_val+"%", "%"+search_val], function(err, rows, fields){
			if(err) throw err;
			var columns = {
				db: ['rname', 'aid', 'name', 'rrating'],
				display: ['Release', 'ArtistID', 'Artist', 'Rating'],
			}
			var data = rows.map(function(obj){
				return splitFields(obj, columns);
			});
			//console.log(req.body.artist_name);
			res.render('results', { title: 'search by release', category: 'Releases', query: search_val, results: data});
			// res.send(rows[0].artistname);
		});	
	}
});

router.get('/track-search', function(req, res, next) {
	var search_val = req.query["track_name"];
	if(search_val == ''){
		res.render('results', { title: 'search by track', category: 'Tracks', query: search_val, results: ''});
	}
	else{
		console.log(search_val);	
		db.query("SELECT t.tname, t.tid, a.name, a.aid, r.rname, r.rid, t.duration, t.trating FROM contains c INNER JOIN Tracks t ON c.tid = t.tid INNER JOIN Releases r ON c.rid = r.rid INNER JOIN publishes p ON p.rid = r.rid INNER JOIN Artists a ON p.aid = a.aid HAVING t.tname LIKE ? ORDER BY CASE WHEN t.tname LIKE ? THEN 0 WHEN t.tname LIKE ? THEN 1 WHEN t.tname LIKE ? THEN 2 ELSE 3 END", ["%"+search_val+"%", search_val, search_val+"%", "%"+search_val], function(err, rows, fields){
			if(err) throw err;
			var columns = {
				db: ['tname', 'rid', 'aid', 'name', 'rname', 'duration', 'trating'],
				display: ['Track', 'AlbumID', 'ArtistID', 'Artist', 'Release', 'Duration', 'Rating'],
			}
			var data = rows.map(function(obj){
				return splitFields(obj, columns);
			});
			console.log(data[0])
			//console.log(req.body.artist_name);
			res.render('results', { title: 'search by track', category: 'Tracks', query: search_val, results: data});
			// res.send(rows[0].artistname);
		});	
	}

});

router.get('/tag-search', function(req, res, next) {
	var search_val = req.query["tag_name"];
	console.log(search_val);
		db.query("SELECT a.aid, a.name, a.type, a.locality, a.arating, a.imageurl, GROUP_CONCAT(t.tagname ORDER BY t.aid) AS tags FROM Artists a LEFT JOIN tagged t ON a.aid = t.aid GROUP BY a.name HAVING tags LIKE ? ORDER BY CASE WHEN a.name LIKE ? THEN 0 WHEN a.name LIKE ? THEN 1 WHEN a.name LIKE ? THEN 2 ELSE 3 END", ["%"+search_val+"%", search_val, search_val+"%", "%"+search_val], function(err, rows){
		if(err) throw err;
		var columns = {
			db: ['aid', 'name', 'imageurl', 'type', 'locality', 'tags', 'arating'],
			display: ['ArtistID', 'Artist', 'Image', 'Type', 'Locality', 'Tags', 'Rating'],
		}
		var data = rows.map(function(obj){
			return splitFields(obj, columns);
		});

		//console.log(req.body.artist_name);
		res.render('results', { title: 'search by tag', category: 'Tag', query: search_val, results: data});
		// res.send(rows[0].artistname);
	});	

});

router.get('/user-page', function(req, res, next) {
	var id = req.query["user_id"];
	console.log(id);
	async.parallel({
		usr: function(callback) {
			db.query("SELECT username FROM Users WHERE uid = ?", [id], function(err, rows, fields){
				if (err) throw err;
				callback(null, rows);
			});
		},
		artist_ratings: function(callback) {
			db.query("SELECT a.name a.aid, ra.rating, ra.comment FROM rates_artist ra INNER JOIN Artists a ON ra.aid = a.aid AND ra.uid = ?", [id], function(err, rows, fields){
				if (err) throw err;
				callback(null, rows);
			});
		},
		release_ratings: function(callback) {
			db.query("SELECT a.name a.aid, ra.rating, ra.comment FROM rates_artist ra INNER JOIN Artists a ON ra.aid = a.aid AND ra.uid = ?", [id], function(err, rows, fields){
				if (err) throw err;
				callback(null, rows);
			});
		},
		track_ratings: function(callback) {
			db.query("SELECT a.name a.aid, ra.rating, ra.comment FROM rates_artist ra INNER JOIN Artists a ON ra.aid = a.aid AND ra.uid = ?", [id], function(err, rows, fields){
				if (err) throw err;
				callback(null, rows);
			});
		},

	}, function(err, results) {
		if (err) throw err;
		res.render('page', { title: 'User: ' + results.usr, category: 'User', user: results.usr, artist_ratings: results.artist_ratings, release_ratings: results.release_ratings, track_ratings: results.track_ratings});
	});
});

router.get('/artist-page', function(req, res, next) {
	var id = req.query["artist_id"];
	console.log(id);
	async.parallel({
		artist: function(callback) {
			db.query("SELECT name, type, locality FROM Artists WHERE aid = ?", [id], function(err, rows, fields){
				if (err) throw err;
				callback(null, rows);
			});
		},
		ratings: function(callback) {
			db.query("SELECT u.username, u.uid, ra.rating, ra.comment FROM rates_artist ra INNER JOIN Artists a ON ra.aid = a.aid INNER JOIN Users u ON ra.uid = u.uid AND a.aid = ? LIMIT 10", [id], function(err, rows, fields){
				if (err) throw err;
				callback(null, rows);
			});
		},
		releases: function(callback) {
			db.query("SELECT r.rid, r.rname, a.aid, a.name FROM publishes p LEFT JOIN Releases r ON p.rid = r.rid INNER JOIN Artists a ON p.aid = a.aid AND a.aid = ?", [id], function(err, rows, fields){
				if (err) throw err;
				callback(null, rows);
			});
		},
		tracks: function(callback) {
			db.query("SELECT t.tname, t.tid, r.rname, r.rid, t.duration FROM contains c INNER JOIN Tracks t ON c.tid = t.tid INNER JOIN Releases r ON c.rid = r.rid INNER JOIN publishes p ON p.rid = r.rid INNER JOIN Artists a ON p.aid = a.aid AND a.aid = ?", [id], function(err, rows, fields){
				if (err) throw err;
				callback(null, rows);
			});
		},
		tags: function(callback) {
			db.query("SELECT GROUP_CONCAT(t.tagname ORDER BY t.aid) AS tags FROM Artists a LEFT JOIN tagged t ON a.aid = t.aid AND a.aid = ?", [id], function(err, rows){
				if (err) throw err;		
				var columns = {
					db: ['tags'],
					display: ['tags'],
				}
				var data = rows.map(function(obj){
					return splitFields(obj, columns);
				});
				callback(null, data);
			});
		},

	}, function(err, results) {
		if (err) throw err;
		console.log(results.artist);
		res.render('page', { title: 'Artist: ' + results.artist[0].name, category: 'Artist', artist: results.artist, ratings: results.ratings, releases: results.releases, tracks: results.tracks, tags: results.tags});
	});
});

router.get('/release-page', function(req, res, next) {
	var id = req.query["release_id"];
	console.log(id);
	async.parallel({
		release: function(callback) {
			db.query("SELECT rname, rid FROM Releases WHERE rid = ?", [id], function(err, rows, fields){
				if (err) throw err;
				callback(null, rows);
			});
		},
		ratings: function(callback) {
			db.query("SELECT u.username, u.uid, rr.rating, rr.comment FROM rates_release rr INNER JOIN Releases r ON rr.rid = r.rid INNER JOIN Users u ON rr.uid = u.uid AND r.rid = ?", [id], function(err, rows, fields){
				if (err) throw err;
				callback(null, rows);
			});
		},
		artist: function(callback) {
			db.query("SELECT r.rname, a.aid, a.name FROM publishes p INNER JOIN Releases r ON p.rid = r.rid INNER JOIN Artists a ON p.aid = a.aid AND r.rid = ?", [id], function(err, rows, fields){
				if (err) throw err;
				callback(null, rows);
			});
		},
		tracks: function(callback) {
			db.query("SELECT t.tname, t.tid, r.rname, r.rid, t.duration FROM contains c INNER JOIN Tracks t ON c.tid = t.tid INNER JOIN Releases r ON c.rid = r.rid AND r.rid = ?", [id], function(err, rows, fields){
				if (err) throw err;
				callback(null, rows);
			});
		},

	}, function(err, results) {
		if (err) throw err;
		res.render('page', { title: 'Release: ' + results.release[0].rname, category: 'Release', release: results.release, ratings: results.ratings, artist: results.artist, tracks: results.tracks});
	});
});

router.get('/track-page', function(req, res, next) {
	var id = req.query["track_id"];
	console.log(id);
	async.parallel({
		track: function(callback) {
			db.query("SELECT tname FROM Tracks WHERE tid = ?", [id], function(err, rows, fields){
				if (err) throw err;
				callback(null, rows);
			});
		},
		ratings: function(callback) {
			db.query("SELECT u.username, u.uid, rt.rating, rt.comment FROM rates_track rt INNER JOIN Tracks t ON rt.tid = t.tid INNER JOIN Users u ON rt.uid = u.uid AND t.tid = ?", [id], function(err, rows, fields){
				if (err) throw err;
				callback(null, rows);
			});
		},
		artist_release: function(callback) {
			db.query("SELECT t.tname, t.tid, a.name, a.aid, r.rname, r.rid, t.duration, t.trating FROM contains c INNER JOIN Tracks t ON c.tid = t.tid INNER JOIN Releases r ON c.rid = r.rid INNER JOIN publishes p ON p.rid = r.rid INNER JOIN Artists a ON p.aid = a.aid AND t.tid = ?", [id], function(err, rows, fields){
				if (err) throw err;
				callback(null, rows);
			});
		},
	}, function(err, results) {
		if (err) throw err;
		console.log(results.artist_release);
		res.render('page', { title: 'Artist: ' + results.artist, category: 'Track', title: results.artist, ratings: results.ratings, artist_release: results.artist_release});
	});
});


var splitFields = function(entry, fields){
	var newObj = {};
	for (var i = 0; i < fields.db.length; ++i){
		if (fields.db[i] === "tags" && entry[fields.db[i]] != null) {
			newObj[fields.display[i]] = entry[fields.db[i]].split(',');
			// console.log(newObj[fields.display[i]]);
		}
		else { 
			newObj[fields.display[i]] = entry[fields.db[i]];
		}
	}
	return newObj;
}

module.exports = router;
