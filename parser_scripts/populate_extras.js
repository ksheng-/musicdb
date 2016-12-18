var parse = require('csv-parse');
var mysql = require('mysql');
var fs = require('fs');
var NB = require('nodebrainz');

var nb = new NB({userAgent:'music-recommendation-app/0.0.1 ( http://kevinsheng.net )', retryOn: true, retryDelay: 10000, retryCount: 10});

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
			(function myLoop(index, delay){
				setTimeout(function () {
					queryMB(output[index]);
					if (index == output.length - 1) {
						console.log("Connection ended");
					}
					if (--delay) 
						myLoop(index, delay);
				}, 1000);
			})(row, 10);
		}	
	});
});

var queryMB = function(entry){
	if (entry.MBID != ''){
		nb.artist(entry.MBID, {inc:'url-rels'}, function(err, response){
			console.log(entry.ArtistName + " queued MBID request " + entry.MBID);
			if (err) throw err;
			var artists_id = {
				ArtistID_MSS: entry.ArtistID
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
				console.log(entry.ArtistName + " inserted MBID info into the db");
			});
		});
	}
}
var splitFields = function(entry, fields){
	var newObj = {};
	for (var i = 0; i < fields.length; ++i){
		newObj[fields[new_names[i]]] = entry[fields[old_names[i]]];
	}
	return newObj;
}

