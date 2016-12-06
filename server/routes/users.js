var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req,res,next){

	console.log(req.body.username + ' ' + req.body.password);
	if (!req.body.username || !req.body.password){
		res.status(400).send('No username or password specified!');
	}

	var query_string = "SELECT uid, uname FROM user WHERE uname = ? AND psw = ? ";

	console.log("sending query");
	db.query(query_string, [req.body.username, req.body.password], function(err,rows,fields){
		if (err) throw err;
		if (rows.length < 1){
			res.status(403).send('Invalid credentials!');
		} else{
			console.log("User " + req.body.username + " has logged in\n");
			res.status(200).send(rows[0].uname);
		}
	});

});


router.post('/signup', function(req,res,next){

	console.log(req.body.username + ' ' + req.body.password);
	if (!req.body.username || !req.body.password){
		res.status(400).send('No username or password specified!');
	}

	var query_string = "SELECT * FROM user WHERE uname = ?";

	console.log("sending query");
	db.query(query_string, [req.body.username], function(err,rows,fields){
		if (err) throw err;
		if (rows.length > 0){
			res.status(403).send('0');
		} else{

			var query_string = "INSERT INTO user(uname,psw) VALUES(?,?)";
			db.query(query_string, [req.body.username, req.body.password], function(err, rows, fields){
				if(err) throw err;
				else{
					console.log("User " + req.body.username + " has registered\n");
					res.status(200).send('1');
				}
			});
		}
	});

});


module.exports = router;
