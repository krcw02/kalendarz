let d = new Date();
let n = new Date();
let firstDay = 0;
let lastday = 0;
let dayofmonth = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
window.onload = () => {

    create();
    XD();
}

function XD() {
    let y = document.querySelector("#year").value;
    let m = document.querySelector("#month").value;

    d.setFullYear(y, m, 0);
    firstDay = d.getDay();
    d.setFullYear(y, m, d.getDay());

    if (dayofmonth[m] == 0) {
        if (y % 4 == 0) lastday = 29;
        else lastday = 28;
    } else {
        lastday = dayofmonth[m];
    }
    createcal();


}
function create() {
    let month = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
    let inner = `<select class="nav-opt" id="month" onchange="XD()" name="month">`;
    for (let i = 0; i < 12; i++) {
        inner += `<option value="${i}">${month[i]}</option>`;
    }
    inner += `</select>  <select class="nav-opt" id="year" onchange="XD()" name="month">`;
    for (let i = 2020; i <= 2021; i++) {
        inner += `<option value="${i}">${i}</option>`;
    }
    inner += `</select>`;
    document.querySelector(".nav").innerHTML = inner;

    document.querySelector("#month").value = d.getMonth();
    document.querySelector("#year").value = d.getFullYear();


}
function createcal() {

    let day = `
    <div class="day">Poniedziałek</div>
    <div class="day">Wtorek</div>
    <div class="day">Środa</div>
    <div class="day">Czwartek</div>
    <div class="day">Piątek</div>
    <div class="day">Sobota</div>
    <div class="day">Niedziela</div>`;

    for (let i = 0; i < firstDay; i++) {
        day += `<div class="trans"></div>`;
    }
    for (let i = 1; i <= lastday; i++) {
        if (i == n.getDate() && d.getMonth() == n.getMonth() && d.getFullYear() == n.getFullYear())
            day += `<div class="box d" onclick="pobierz(${i})">${i}</div>`;

        else
            day += `<div class="box" onclick="pobierz(${i})">${i}</div>`;

    }
    document.querySelector(".container").innerHTML = day;

}

// ZADANIA
let terazdata = "";
let terazdzien = 0;
const host = location.origin.replace(/^http/, 'ws')
const ws = new WebSocket(host);
let conversation;
ws.addEventListener("open", e => {
    setTimeout(() => {
        pobierz(n.getDate());
    }, 300)
})
ws.addEventListener("message", e => {
    conversation = JSON.parse(e.data);
    con(conversation);

});

function edytuj(a) {
    if (a == "a") {
        document.querySelector(".tresc").innerHTML = `
        ID zadania: &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<input type="number" maxlength="8" class="abc" id="d"><br>
        Przedmiot:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp <input type="text" maxlength="50" class="abc" id="a"><br>
        Treść zadania: &nbsp&nbsp<input type="text" class="abc" maxlength="200" id="b"><br>
        Klucz dostępu: &nbsp&nbsp<input type="password" maxlength="8" class="abc" id="c"><br>
        <div class="but" onclick='edytuj("b")'>Wyślij</div>`
    } else {
        console.log("TEST");
        let przedmiot = document.querySelector("#a").value;
        let wpis = document.querySelector("#b").value;
        let haslo = document.querySelector("#c").value;
        let id = parseInt(document.querySelector("#d").value);
        let s = {
            type: "edytuj",
            przedmiot: przedmiot,
            wpis: wpis,
            data: terazdata,
            id: id,
            haslo: haslo
        };
        console.log(s);
        ws.send(JSON.stringify(s));
        setTimeout(() => {
            pobierz(terazdzien);
        },300)
    }

}
function dodaj(a) {
    if (a == "a") {
        document.querySelector(".tresc").innerHTML = `
        Przedmiot:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp <input type="text" maxlength="50" class="abc" id="a"><br>
        Treść zadania: &nbsp&nbsp<input type="text" class="abc" maxlength="200" id="b"><br>
        Klucz dostępu: &nbsp&nbsp<input type="password" maxlength="8" class="abc" id="c"><br>
        <div class="but" onclick='dodaj("b")'>Wyślij</div>`
    } else {
        let przedmiot = document.querySelector("#a").value;
        let wpis = document.querySelector("#b").value;
        let haslo = document.querySelector("#c").value;
        let s = {
            type: "dodaj",
            przedmiot: przedmiot,
            wpis: wpis,
            data: terazdata,
            haslo: haslo
        };
        ws.send(JSON.stringify(s));
        setTimeout(() => {
            pobierz(terazdzien);
        },300)
    }




}
function usun(a) {
    if (a == "a") {
        document.querySelector(".tresc").innerHTML = `
        ID zadania: &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<input type="number" maxlength="8" class="abc" id="d"><br>
        Klucz dostępu: &nbsp&nbsp<input type="password" maxlength="8" class="abc" id="c"><br>
        <div class="but" onclick='usun("b")'>Wyślij</div>`
    } else {
        console.log("TEST"); 
        let haslo = document.querySelector("#c").value;
        let id = parseInt(document.querySelector("#d").value);
        let s = {
            type: "usun",
            id: id,
            haslo: haslo
        };
        console.log(s);
        ws.send(JSON.stringify(s));
        setTimeout(() => {
            pobierz(terazdzien);
        },300)
    }
}
function pobierz(d) {
    let y = document.querySelector("#year").value;
    let m = document.querySelector("#month").value;
    m++;
    if (m < 10) m = '0' + m;
    if (d < 10) d = '0' + d;
    terazdata = `${y}-${m}-${d}`;
    terazdzien = d;
    document.querySelector(".hl").innerHTML = `Zadania ${d}/${m}/${y}`;
    let s = {
        type: "data",
        data: `${y}-${m}-${d}`
    };
    ws.send(JSON.stringify(s));
}
function con(c) {
    let tresc = "";
  
    if (c.length > 0) {
        for (let i = 0; i < c.length; i++) {
            tresc += `<p><h4>${c[i].przedmiot} #${c[i].id}</h4>${c[i].opis}</p>`;
        }
        document.querySelector(".tresc").innerHTML = tresc;
    } else {
        document.querySelector(".tresc").innerHTML = "<h4>Brak zadan w tym dniu</h4>";
    }
}