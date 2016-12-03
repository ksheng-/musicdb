var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'musicdb' });
	//res.send("test")
});
/*
router.post('/music', function(req, res, next) {
	//res.render('index', { title: 'musicdb' });
	res.send("post")
});
*/
router.get('/music', function(req, res, next) {
	//res.render('index', { title: 'musicdb' });
	res.send("get")
});

module.exports = router;
