const express = require('express');
const WebSocketServer = require("ws").Server;
const EventEmitter = require('events');
const port = process.env.PORT || 3000;
const app = express();
const mysql = require('mysql');
const http = require('http');
const path = require('path');
const server = http.createServer(app);
server.listen(port);
const wws = new WebSocketServer({ server: server })
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '/public')));
let haslo = "Apex";
var con = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "password",
    database: "test",
    timezone: 'utc',
    dateStrings: 'date'
});
con.connect(function (err) {
    if (err) throw err;

});

app.get('/', function (req, res) {
    res.render('kalendarz');
})
app.get('/lista', function (req, res) {
    res.render('lista');
})

wws.on("connection", ws => {
    let data = "";

    console.log("Incoming conection!");
    ws.on("message", message => {
        try {
            data = JSON.parse(message);
        } catch (e) {
            console.log("Something went wrong!" + e);
        }

        if (data.type == "data") {

            con.query(`SELECT * FROM przedmioty WHERE data="${data.data}"`, function (err, result, fields) {
                if (err) throw err;
                ws.send(JSON.stringify(result));

            });
        }
        else if (data.type == "dodaj") {
            if (data.haslo == haslo) {
                con.query(`INSERT INTO przedmioty VALUES (NULL, "${data.przedmiot}","${data.data}","${data.wpis}")`, function (err, result, fields) {
                    if (err) throw err;

                });
            }

        }
        else if (data.type == "usun") {
            if (data.haslo == haslo) {
                con.query(`DELETE FROM przedmioty WHERE id=${data.id}`, function (err, result, fields) {
                    if (err) throw err;

                });

            }
        }
        else if (data.type == "edytuj") {
            if (data.haslo == haslo) {
                if (data.przedmiot != "") {
                    con.query(`UPDATE przedmioty SET przedmiot="${data.przedmiot}" WHERE id=${data.id}`, function (err, result, fields) {
                        if (err) throw err;

                    });
                }
                if (data.wpis != "") {
                    con.query(`UPDATE przedmioty SET opis="${data.wpis}" WHERE id=${data.id}`, function (err, result, fields) {
                        if (err) throw err;

                    });
                }

            }
        }
        else if (data.type == "all") {
                            
                    con.query(`SELECT * FROM przedmioty WHERE data>=now()-1 ORDER BY data`, function (err, result, fields) {
                        if (err) throw err;
                        ws.send(JSON.stringify(result));

                    });
                
        }

    });
});
