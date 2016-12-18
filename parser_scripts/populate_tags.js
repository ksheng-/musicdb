var parse = require('csv-parse');
var mysql = require('mysql');
var fs = require('fs');
var NB = require('nodebrainz');

var nb = new NB({userAgent:'music-recommendation-app/0.0.1 ( http://kevinsheng.net )', retryOn: true, retryDelay: 10000, retryCount: 5});

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
// DELETE FROM Artist; ALTER TABLE Artist AUTO_INCREMENT = 1; DELETE FROM Releases; ALTER TABLE Releases AUTO_INCREMENT = 1; DELETE FROM Tracks; ALTER TABLE Tracks AUTO_INCREMENT = 1;




var filename = 'mstags.csv';
fs.readFile(filename, 'utf8', function(err, data) {
	if (err) throw err;
	
	parse(data, options.csv, function(err, output){
		if (err) throw err;
		
		for (var row = 0; row < output.length; ++row) {
			// Artist table
			console.log("Row " + output[row].ArtistName + " initiated")
			var artists_has = {
				ArtistID: output[row].ArtistID,
				// get picture, type, DOB from mb
				tag: output[row].ArtistTag,
			};
			connection.query('INSERT IGNORE INTO ?? SET ?', ['TAG_TEMP', artists_has], function(err, result){
				if (err) throw err;	   
				console.log('Successfully inserted non MBID fields for Artists');
			});
		}	
	});
});

