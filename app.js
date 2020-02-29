var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const multiparty = require('multiparty');
var XLSX = require('xlsx');
var fs = require('fs');
var mysql = require('mysql');
var connection = mysql.createConnection({
  	host     : 'localhost',
  	user     : 'databot',		
  	password : 'smcolon2020!@',
	database: 'memorial'
});

connection.connect();

var workbook = XLSX.readFile('31.xlsx');
var firstWSheetName = workbook.SheetNames[0];
var sht_easy = workbook.Sheets["easy"];
var sht_middle = workbook.Sheets["middle"];
var sht_high = workbook.Sheets["high"];
var serverTime = new Date();

var indexRouter = require('./routes/index');
var quizRouter = require('./routes/quiz');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('trust proxy', true);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Dipokal HHJ: 최소한의 보안은 하는게 좋을 것 같습니다.
app.disable('x-powered-by');


app.get('/31exam',quizRouter);

app.get('/', indexRouter);
app.post('/submit', function(req, res){
  const ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
  console.log(req.body.name + req.body.phone + ip);
  connection.query('SELECT count(*) FROM users WHERE phone = ? OR ip = ?', [req.body.phone, req.body.ip], function (error, results, fields) {
    if (error) {
      console.log(error);
    } 
    if(results) {
      res.end("already");
    } else {
      connection.query('INSERT INTO users (name, phone, ip, date) VALUES (?, ?, ?, ?)', [req.body.name, req.body.phone, req.body.ip, serverTime.toFormat('YYYY/MM/DD')], function (error, results, fields) {
        if (error) {
          console.log(error);
        } 
        res.end();
      });
    }
  });
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//module.exports = app;

app.listen(3000, function () {
  console.log("server starts at 3000");
});
