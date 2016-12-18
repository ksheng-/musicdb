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
		database: 'music',
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
		
		for (var row = 0; row < output.length; ++row) {
			// Artist table
			if (output[row].MBID == 0) {
				var entry = {
					tname: output[row].Title,
					tempo:
					
					// locality: output[row].ArtistLocation
				};
				connection.query('INSERT INTO ?? SET ?', ['Tracks', entry], function(err, result){
					if (err) throw err;	   
					console.log(entry.name + " inserted into the db (no MBID)")
				});
			}
			else {
				(function(i) {
					nb.artist(output[i].MBID, function(err, response){
						console.log(output[i].ArtistName + " queued MBID request");
						if (err) throw err;
						var entry = {
							name: output[i].ArtistName,
							type: response.type,
							DOB: response["life-span"].begin,
							locality: output[i].ArtistLocation
						};
						connection.query('INSERT INTO ?? SET ?', ['Tracks', entry], function(err, result){
							if (err) throw err;
							console.log(output[i].ArtistName + " inserted into the db")
							if (i == output.length - 1) {
								connection.end();
								console.log("Connection Ended")
							}
						});
					});
				})(row)
			}
		}
	});
});

