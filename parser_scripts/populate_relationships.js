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




var filename = 'mssubset.csv';
fs.readFile(filename, 'utf8', function(err, data) {
	if (err) throw err;
	
	parse(data, options.csv, function(err, output){
		if (err) throw err;
		
		for (var row = 0; row < output.length; ++row) {
			// Artist table
			var artists_id1 = {
				artist1: output[row].ArtistID
			};
			var album = {
				album: output[row].AlbumID
			};
			var releases_id = {
				AlbumID_MSS: output[row].AlbumID
			};
			var tracks_id = {
				SongID_MSS: output[row].SongID
			};		
			// connection.query('UPDATE ?? SET ? WHERE ?', ['Releases', artists_id1, releases_id], function(err, result){
				// if (err) throw err;	  
				// console.log('Successfully inserted non MBID fields for Releases');
			// });
			connection.query('UPDATE ?? SET ? WHERE ?', ['Tracks', album, tracks_id], function(err, result){
				if (err) throw err;	  
				console.log('Successfully inserted non MBID fields for Releases');
			});
		}	
	});
});

var splitFields = function(entry, fields){
	var newObj = {};
	for (var i = 0; i < fields.length; ++i){
		newObj[fields[new_names[i]]] = entry[fields[old_names[i]]];
	}
	return newObj;
}

