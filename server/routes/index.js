var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'musicdb' });
	//res.send("test")
});

router.get('/searchByArtist', function(req, res, next) {
	db.query("SELECT * FROM artist LIMIT 1", function(err, rows,
			fields){
				if(err) throw err;
				console.log("inside the query");
				res.send(rows[0].artistname);
			});
});

router.get('/searchByAlbum', function(req, res, next) {
	//res.render('index', { title: 'musicdb' });
	res.send("Search By Album!")
});

router.get('/searchBytrack', function(req, res, next) {
	//res.render('index', { title: 'musicdb' });
	res.send("Search By Track!")
});

router.get('/searchByTag', function(req, res, next) {
	//res.render('index', { title: 'musicdb' });
	res.send("Search By Tag!")
});

module.exports = router;
