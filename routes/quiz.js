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
//엄청난 오류코드 
// Access denied for user 'root'@'localhost' (using password:yes) 비번 확인 해주세요
//서버는 켜져 있겠죠?
//자 한번 실행해보겠습니다
/* GET home page. */
//신기한게 있는데
//주소/quiz 만 render가 안되네요
//e다른 주소로는 다되는데 
//..ㅎㅎㅎ

router.get('/31exam', function(req, res, next) {	
	conn.query('select * from question ORDER BY RAND() LIMIT 10;',(err,result) => {
		if(err) throw err;
		let table = make_table(result);
		res.render('quiz',{table:table,quiz:result});
	})
});

module.exports = router;

function make_table(result) {//이거 문제? //이건 테이블 형식으로 그냥 보여주는 거고 dr
	let list = "";
    for(let i =0;i<result.length;i++)
    {list += `<tbody><tr><td>${result[i].ID}</td><td>${result[i].q}</td>		<td>${result[i].a}</td></tr></tbody>`}
    return list;
}

// function check_same(all, object) {				//all: 전체 배열, object: 확인할 객체
// 	var a;
// 	for (a=0; a<all.length; a++) {
// 		if (all[a].number == object.number) {		//확인번호가 서로 같다면			
// 			return false;					//같은 객체가 안에 있음
// 			}
// 	}
// 	return true; 		//안에 없음
// }