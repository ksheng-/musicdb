var cm = require('/root/mdb/node_modules/csv-mysql');
var fs = require('fs');

var filename = "avg_rating.csv";
fs.readFile(filename, 'utf8', function(err, data) {
	if (err) throw err;
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
		},
		table: 'tmp'
	}	
	
	cm.import(options, data, function(err, txt){
    		if (err)
        		console.log(err+": "+txt);
    		else
        		console.log("Import completed");
	});

});



