var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'musicdb' });
	//res.send("test")
});

router.get('/artist-search', function(req, res, next) {
	db.query("SELECT * FROM artist", function(err, rows, fields){
				if(err) throw err;
				console.log("inside the query");
				res.render('results', { title: 'search by artist', category: 'Artists', results: rows});
				// res.send(rows[0].artistname);
			});	
});

router.get('/album-search', function(req, res, next) {
	//res.render('index', { title: 'musicdb' });
	res.send("Search By Album!")
});

router.get('/track-search', function(req, res, next) {
	//res.render('index', { title: 'musicdb' });
	res.send("Search By Track!")
});

router.get('/language-search', function(req, res, next) {
	//res.render('index', { title: 'musicdb' });
	res.send("Search By Tag!")
});

router.get('/tag-search', function(req, res, next) {
	//res.render('index', { title: 'musicdb' });
	res.send("Search By Tag!")
});

router.post('/login', function(req, res, next){
	console.log('posting');
});

module.exports = router;
