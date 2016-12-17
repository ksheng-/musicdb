var parse = require('csv-parse');
var mysql = require('mysql');
var fs = require('fs');
var NB = require('nodebrainz');

var nb = new NB({userAgent:'music-recommendation-app/0.0.1 ( http://kevinsheng.net )', retryOn: true, retryDelay: 3000, retryCount: 3});

var options = {
	mysql: {
		host: 'localhost',
		user: 'root',
		password: 'root',
		database: 'mdb',
	},
	csv: {
		comment: '#',
		quote: '"',
		relax: true,
		columns: true,
	}
}


var connection = mysql.createConnection(options.mysql);
connection.connect();

var filename = 'mssubset.csv';
fs.readFile(filename, 'utf8', function(err, data) {
	if (err) throw err;
	
	parse(data, options.csv, function(err, output){
		if (err) throw err;

		for (var i = 0; i < output.length; ++i) {
			// Artist table
			nb.artist('e0140a67-e4d1-4f13-8a01-364355bee46e', function(err, response){
				if (err) throw err;
				var entry = {
					name: output.ArtistName,
					type: response.type,
					DOB: response.life-span.begin,
				};
				connection.query('INSERT INTO ?? SET ?', ['Artist', entry], function(err, result){
					if (err) throw err;	   
				});
			});
		}

		// Artist table
		fields = {
			old_names: ['ArtistName','ArtistLocation','psw'],
			new_names: ['uid','uname','psw'],
		}
		// str = JSON.stringify(output.map(function(obj){return splitFields(obj, keep)}), null, 4);
	
		// Extract relevant columns from "seed" tables
		// output is array of objects
		// var table_obj = output.map(function(obj){
			// return splitFields(obj, fields);
		// });
		
		// table = 'Artist';
		// for (var i = 0; i < table_obj.length; ++i){
			// connection.query('INSERT INTO ?? SET ?', [table, table_obj[i]], function(err, result){
				// if (err) throw err;	   
			// });
		// }
		connection.end();
	});
});


var splitFields = function(entry, fields){
	var newObj = {};
	for (var i = 0; i < fields.length; ++i){
		newObj[fields[new_names[i]]] = entry[fields[old_names[i]]];
	}
	return newObj;
}

