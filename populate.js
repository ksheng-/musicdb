var parse = require('csv-parse');
var mysql = require('mysql');
var fs = require('fs');

var options = {
	mysql: {
		host: '127.0.0.1',
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
 
var filename = 'users.csv';
fs.readFile(filename, 'utf8', function(err, data) {
	if (err) throw err;
	
	parse(data, options.csv, function(err, output){
		if (err) throw err;
		fields = {
			old_names: ['uid','uname','psw'],
			new_names: ['uid','uname','psw'],
			types: ['INT','CHAR(16)','CHAR(16)'],
		}
		// str = JSON.stringify(output.map(function(obj){return splitFields(obj, keep)}), null, 4);
		
		var table_obj = output.map(function(obj){
			return splitFields(obj, fields);
		});
		
		field_types = fields.new_names.map(function(names, index){
			return (names + ' ' + fields[types[index]]);
		});
		table = 'user';
		connection.query('CREATE TABLE ?? IF NOT EXISTS ()', [user, field_types], function(err, result){
			if (err) throw err;	   
			for (var i = 0; i < table_obj.length; ++i){
				connection.query('INSERT INTO ?? SET ?', [table, table_obj[i]], function(err, result){
					if (err) throw err;	   
				});
			}
			connection.end();
		});


	});
});


var splitFields = function(entry, fields){
	var newObj = {};
	for (var i = 0; i < fields.length; ++i){
		newObj[fields[new_names[i]]] = entry[fields[old_names[i]]];
	}
	return newObj;
}

