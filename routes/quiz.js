var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var conn = mysql.createConnection({
  	host     : 'localhost',
  	user     : 'databot',		
  	password : 'smcolon2020!@',
	database: 'memorial'
});
conn.connect();


router.get('/31exam', function(req, res, next) {	
	conn.query('SELECT * FROM question ORDER BY RAND() LIMIT 11;',(err,result) => 
		res.render('quiz',{quiz:result});
	})
});

module.exports = router;