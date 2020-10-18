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
    con.query(`UPDATE przedmioty SET opis="XD" WHERE id=4`, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });