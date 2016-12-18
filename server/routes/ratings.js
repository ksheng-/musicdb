var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET users listing. */
router.get('/', function(req,res,next){
	res.send('hello');
});

router.post('/get_rating', function(req, res, next) {
	if(req.body.type == 'avg'){
		var data={
			'number_votes': 129,
			'dec_avg': 2.7,
			'whole_avg': 3
		};
		res.send(data);
	}
	else{
		var data={
			'whole_avg':2
		};
		res.send(data);
	}
});

router.post('/update_rating', function(req, res, next) {
	var rating = req.body.rate;
	var comment = req.body.review;
	var uid = req.body.uid;
	var trackid = req.body.trackid;

	// update database
	
	res.send('succefully commit comment');
});



module.exports = router;
