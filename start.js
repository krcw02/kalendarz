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
    con.query(`SELECT * FROM przedmioty WHERE data>=now() ORDER BY data`, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });