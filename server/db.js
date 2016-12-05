var mysql = require('mysql')
//, async = require('async')



var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'mdb',
});

connection.connect(function(err){
	if(err) throw err;
});

module.exports = connection;
