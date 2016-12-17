var mysql      = require('mysql');
var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : 'root',
	  database : 'music'
});

connection.connect();

var create = {
	artists: 'CREATE TABLE IF NOT EXISTS Artists (aid INTEGER AUTO_INCREMENT, name VARCHAR(30), type VARCHAR(6), DOB DATE, arating REAL, locality VARCHAR(50), PRIMARY KEY (aid));',
	releases: 'CREATE TABLE IF NOT EXISTS Releases (rid INTEGER AUTO_INCREMENT, format VARCHAR(30), rname VARCHAR(6), rrating REAL, PRIMARY KEY (rid));',
	tracks: 'CREATE TABLE IF NOT EXISTS Tracks (tid INTEGER AUTO_INCREMENT, tname VARCHAR(30), trating REAL, number INTEGER, tempo REAL, timesig INTEGER, mode INTEGER, loudness REAL, PRIMARY KEY (tid));',
	users: 'CREATE TABLE IF NOT EXISTS Users (uid INTEGER AUTO_INCREMENT, admin BIT NOT NULL DEFAULT 0, username VARCHAR(30), pw VARCHAR(30), UNIQUE(username), PRIMARY KEY (uid));',
	rates_artist: 'CREATE TABLE IF NOT EXISTS rates_artist (uid INTEGER, aid INTEGER, rating INTEGER, comment VARCHAR(2000), PRIMARY KEY (uid, aid), FOREIGN KEY (uid) REFERENCES Users (uid) ON DELETE CASCADE, FOREIGN KEY (aid) REFERENCES Artists (aid) ON DELETE CASCADE);',
	rates_release:'CREATE TABLE IF NOT EXISTS rates_release (uid INTEGER, rid INTEGER, rating INTEGER, comment VARCHAR(2000), PRIMARY KEY (uid, rid), FOREIGN KEY (uid) REFERENCES Users (uid) ON DELETE CASCADE, FOREIGN KEY (rid) REFERENCES Releases (rid) ON DELETE CASCADE);',
	rates_track: 'CREATE TABLE IF NOT EXISTS rates_track (uid INTEGER, tid INTEGER, rating INTEGER, comment VARCHAR(2000), PRIMARY KEY (uid, tid), FOREIGN KEY (uid) REFERENCES Users (uid) ON DELETE CASCADE, FOREIGN KEY (tid) REFERENCES Tracks (tid) ON DELETE CASCADE);',
	tags: 'CREATE TABLE IF NOT EXISTS Tags (tagname VARCHAR(20), PRIMARY KEY (tagname));',
	publishes: 'CREATE TABLE IF NOT EXISTS publishes (aid INTEGER, rid INTEGER, label CHAR(20), PRIMARY KEY (aid, rid), FOREIGN KEY (aid) REFERENCES Artists (aid) ON DELETE CASCADE, FOREIGN KEY (rid) REFERENCES Releases (rid) ON DELETE CASCADE);',
	contains: 'CREATE TABLE IF NOT EXISTS contains (rid INTEGER, tid INTEGER, PRIMARY KEY(rid, tid), FOREIGN KEY (rid) REFERENCES Releases (rid) ON DELETE CASCADE, FOREIGN KEY (tid) REFERENCES Tracks (tid) ON DELETE CASCADE);',
	artist_has: 'CREATE TABLE IF NOT EXISTS artist_has (aid INTEGER, tagname VARCHAR(20) , PRIMARY KEY (aid, tagname), FOREIGN KEY (tagname) REFERENCES Tags (tagname) ON DELETE CASCADE, FOREIGN KEY (aid) REFERENCES Artists (aid) ON DELETE CASCADE);',
	release_has: 'CREATE TABLE IF NOT EXISTS release_has (rid INTEGER, tagname VARCHAR(20), PRIMARY KEY (rid, tagname), FOREIGN KEY (tagname) REFERENCES Tags (tagname) ON DELETE CASCADE, FOREIGN KEY (rid) REFERENCES Releases (rid) ON DELETE CASCADE );',
	track_has: 'CREATE TABLE IF NOT EXISTS track_has (tid INTEGER, tagname VARCHAR(20), PRIMARY KEY (tid, tagname), FOREIGN KEY (tagname) REFERENCES Tags (tagname) ON DELETE CASCADE, FOREIGN KEY (tid) REFERENCES Tracks (tid) ON DELETE CASCADE);'
}

var drop = {
	artists: 'DROP TABLE IF EXISTS Artists;',
	releases: 'DROP TABLE IF EXISTS Releases;',
	tracks: 'DROP TABLE IF EXISTS Tracks;',
	users: 'DROP TABLE IF EXISTS Users;',
	rates_artist: 'DROP TABLE IF EXISTS rates_artist;',
	rates_release: 'DROP TABLE IF EXISTS rates_release;',
	rates_track: 'DROP TABLE IF EXISTS rates_track;',
	tags: 'DROP TABLE IF EXISTS Tags;',
	publishes: 'DROP TABLE IF EXISTS publishes;',
	contains: 'DROP TABLE IF EXISTS contains;',
	artist_has: 'DROP TABLE IF EXISTS artist_has;',
	release_has: 'DROP TABLE IF EXISTS release_has;',
	track_has: 'DROP TABLE IF EXISTS track_has;'
}

for (var table in create) {
	connection.query(create[table], function(err, rows, fields) {
		if (err) throw console.error(err);
	});
}

connection.end();

