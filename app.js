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

var con = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "password",
    database: "test",
    timezone: 'utc'
});
con.connect(function (err) {
    if (err) throw err;

});

app.get('/', function (req, res) {
    res.render('index');
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
        else if(data.type == "dodaj"){

        }
        else if(data.type == "usun"){

        }
        else if(data.type == "edytuj"){

        }

    });
});
