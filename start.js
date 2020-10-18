const mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "password",
    database: "test",
    timezone: 'utc'
  });
con.connect(function(err) {
    if (err) throw err;
    con.query('SELECT * FROM przedmioty WHERE data="2020-10-03"', function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });