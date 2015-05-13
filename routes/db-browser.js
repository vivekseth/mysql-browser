exports.registerRoutes = function(conn, app) {
	app.get('/', convertRouteHandler(conn, showDatabases));
	app.get('/:database', convertRouteHandler(conn, showTables));
	app.get('/:database/:table', convertRouteHandler(conn, showColumns));
}

function showDatabases(conn, req, res) {
	conn.query('SHOW DATABASES;', function(err, rows){
		console.log(err, rows);
		res.render('index', {'databases': rows});
	});
}

function showTables(conn, req, res) {
	var databaseName = req.param('database');
	console.log(databaseName);
	conn.query('SHOW TABLES FROM ??;', databaseName, function(err, rows){

		var modified = [];
		for (var i=0; i<rows.length; i++) {
			var r = rows[i];
			for (var j in r) {
				console.log('a');
				modified.push({'table': r[j]});
				break;
			}
		}

		console.log(modified);

		console.log(err, rows);
		res.render('tables', {'database': databaseName, 'tables': modified});
	});
}

function showColumns(conn, req, res) {
	console.log('fasd');
	var databaseName = req.param('database');
	var tableName = req.param('table');
	console.log(databaseName);
	conn.query('SHOW COLUMNS FROM ??.??;', [databaseName, tableName], function(err, rows){
		console.log(err, rows);
		res.render('columns', {'columns': rows});
	});
}

function convertRouteHandler(conn, f) {
	return function(req, res) {
		f(conn, req, res);
	}
}