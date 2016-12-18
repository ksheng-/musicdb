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
		return;
	}

	var query_string = "SELECT uid, username FROM Users WHERE username = ? AND pw = ? ";

	console.log("sending query");
	db.query(query_string, [req.body.username, req.body.password], function(err,rows,fields){
		if (err) throw err;
		if (rows.length < 1){
			res.status(403).send('0');
			return;
		} else{
			console.log("User " + req.body.username + " has logged in\n");
			console.log(rows[0]);
			res.status(200).send(rows[0]);
			return;
		}
	});

});


router.post('/signup', function(req,res,next){

	console.log(req.body.username + ' ' + req.body.password);
	if (!req.body.username || !req.body.password){
		res.status(400).send('No username or password specified!');
		return;
	}

	var query_string = "SELECT * FROM Users WHERE username = ?";

	console.log("sending query");
	db.query(query_string, [req.body.username], function(err,rows,fields){
		if (err) throw err;
		if (rows.length > 0){
			res.status(403).send('0');
			return;
		} 
		else{

			var query_string = "INSERT INTO Users(username,pw) VALUES(?,?)";
			db.query(query_string, [req.body.username, req.body.password], function(err, rows, fields){
				if(err) throw err;
				else{
					console.log("User " + req.body.username + " has registered\n");
					res.status(200).send('1');
					return;
				}
			});
		}
	});

});


module.exports = router;
