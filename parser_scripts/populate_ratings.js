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
			console.log("Row " + output[row].ArtistName + " initiated")
			var artists_entry = {
				name: output[row].ArtistName,
				// get picture, type, DOB from mb
				locality: output[row].ArtistLocation,
				ArtistID_MSS: output[row].ArtistID
			};
			connection.query('INSERT INTO ?? SET ? ON DUPLICATE KEY UPDATE aid=aid', ['Artists', artists_entry], function(err, result){
				if (err) throw err;	   
				console.log('Successfully inserted non MBID fields for Artists');
			});
			var releases_entry = {
				// get format and albumart from mb
				rname: output[row].ArtistName,
				AlbumID_MSS: output[row].AlbumID
			};
			connection.query('INSERT INTO ?? SET ? ON DUPLICATE KEY UPDATE rid=rid', ['Releases', releases_entry], function(err, result){
				if (err) throw err;	  
				console.log('Successfully inserted non MBID fields for Releases');
			});
			var tracks_entry = {
				tname: output[row].Title,
				tempo: output[row].Tempo,
				timesig: output[row].TimeSignature,
				keysig: output[row].KeySignature,
				danceability: output[row].Danceability,
				duration: output[row].Duration,
				SongID_MSS: output[row].SongID,
			};
			connection.query('INSERT IGNORE INTO ?? SET ? ON DUPLICATE KEY UPDATE tid=tid', ['Tracks', tracks_entry], function(err, result){
				if (err) throw err;	   
				console.log('Successfully inserted non MBID fields for Tracks');
			});
			

			if (output[row].MBID != ''){
				(function(index) {
					nb.artist(output[index].MBID, {inc:'url-rels'}, function(err, response){
						console.log(output[index].ArtistName + " queued MBID request");
						if (err) throw err;
						var artists_id = {
							ArtistID_MSS: output[index].ArtistID
						};
						var artists_entry = {
							type: response.type,
							DOB: response["life-span"].begin,
						};

						for (var i = 0; i < response.relations.length; ++i) {
							if (response.relations[i].type === "image") {
								artists_entry.imageurl = response.relations[i].url.resource;
							}
						}

						connection.query('UPDATE ?? SET ? WHERE ?', ['Artists', artists_entry, artists_id], function(err, result){
							if (err) throw err;
							console.log(output[index].ArtistName + " inserted MBID info into the db");
							if (index == output.length - 1) {
								connection.end();
								console.log("Connection ended");
							}
						});
						
						// var releases_id = {
							// AlbumID_MSS: output[i].AlbumID;
						// }
						// var releases_entry = {
							// type: response.type,
							// DOB: response["life-span"].begin,
							// image: ,
						// };

						// connection.query('UPDATE ?? SET ? WHERE ?', ['Releases', releases_entry, releases_id], function(err, result){
							// if (err) throw err;
							// console.log(output[i].ArtistName + " inserted MBID info into the db")
							// if (i == output.length - 1) {
								// connection.end();
								// console.log("Connection Ended")
							// }
						// });
					});
				})(row);
			}
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

