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

const host = location.origin.replace(/^http/, 'ws')
const ws = new WebSocket(host);
let conversation;
ws.addEventListener("open", e => { pobierz(n.getDate()); })
ws.addEventListener("message", e => {
    conversation = JSON.parse(e.data);
    con(conversation);

});

function edytuj() {
    var okienko = window.open("", "Edytuj", "width=400,height=600");
    
}
function dodaj() {
    var przedmiot = prompt("Podaj przedmiot");
    var wpis = prompt("wpis");
    if(przedmiot != null && wpis != null){
        let s = {
            type: "dodaj",
            przedmiot: przedmiot,
            wpis: wpis
        };
        ws.send(JSON.stringify(s));
    }
    
}
function usun() {
    var okienko = window.open("", "Edytuj", "width=400,height=600");
    okienko.document.write();
}
function pobierz(d) {
    let y = document.querySelector("#year").value;
    let m = document.querySelector("#month").value;
    m++;
    if (m < 10) m = '0' + m;
    if (d < 10) d = '0' + d;
    document.querySelector(".hl").innerHTML = `Zadania ${d}/${m}/${y}`;
    let s = {
        type: "data",
        data: `${y}-${m}-${d}`
    };
    ws.send(JSON.stringify(s));
}
function con(c) {
    let tresc = "";
    console.log(c);
    console.log(c.length);
    if (c.length > 0) {
        for (let i = 0; i < c.length; i++) {
            tresc += `<p><h4>${c[i].przedmiot}</h4>${c[i].opis}</p>`;
        }
        document.querySelector(".tresc").innerHTML = tresc;
    } else {
            document.querySelector(".tresc").innerHTML = "<h4>Brak zadan w tym dniu</h4>";
    }
}