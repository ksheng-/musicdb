var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'musicdb' });
	//res.send("test")
});

router.get('/searchByArtist', function(req, res, next) {
	//res.render('searchresults', { title: 'filter by artist' });
	res.send("Search By Artist")
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
