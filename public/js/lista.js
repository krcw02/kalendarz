let dniTygodnia = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];

window.onload = () => {
    pobierz();

}
function pobierz(){
  let s = {
        type: "all"

    };

    setTimeout(() => {
        ws.send(JSON.stringify(s));
    }, 100);  
}
const host = location.origin.replace(/^http/, 'ws')
const ws = new WebSocket(host);
let conversation;
let nowID;
ws.addEventListener("open", e => { })
ws.addEventListener("message", e => {
    conversation = JSON.parse(e.data);

    create();

});
function dzien(a) {
    let data = new Date(a);
    return data;
}
function create() {
    console.log(conversation);
    let trasc = " ";
    if (conversation.lenght != 0) {
        tresc = `
        <div class="s1">
        <h2>${dniTygodnia[dzien(conversation[0].data).getDay() - 1]} ${conversation[0].data}</h2>
        <p>
        <h3>${conversation[0].przedmiot}</h3>
        <div class="p">
            <div class="b" onclick="edytuj(${conversation[0].id})">EDYTUJ&nbsp</div>
            <div class="b" onclick="usun(${conversation[0].id})">USUŃ</div>
        </div>
        ${conversation[0].opis}
        </p>
        `;
        for (var i = 1; i < conversation.length; i++) {
            if (conversation[i].data == conversation[i - 1].data) {
                tresc += `<p>
                <h3>${conversation[i].przedmiot}</h3>
                <div class="p">
                    <div class="b" onclick="edytuj(${conversation[i].id})">EDYTUJ&nbsp</div>
                    <div class="b" onclick="usun(${conversation[i].id})">USUŃ</div>
                </div>
                ${conversation[i].opis}
                </p>`;
            } else {
                tresc += `</div> <div class="s1">
                <h2>${dniTygodnia[dzien(conversation[i].data).getDay() - 1]} ${conversation[i].data}</h2><p>
                <h3>${conversation[i].przedmiot}</h3>
                <div class="p">
                    <div class="b" onclick="edytuj(${conversation[i].id})">EDYTUJ&nbsp</div>
                    <div class="b" onclick="usun(${conversation[i].id})">USUŃ</div>
                </div>
                ${conversation[i].opis}
                </p>`;
            }
        }
        tresc += `</div>`;

    } else {
        tresc = `Brak danych`;
    }
    document.querySelector(".content").innerHTML = tresc;

}
function edytuj(a) {
    if (a != "a") {
        nowID = a;
        document.querySelector(".content").innerHTML = `<div class="form">
        Przedmiot:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp <input type="text" maxlength="50" class="abc" id="a"><br>
        Treść zadania: &nbsp&nbsp<input type="text" class="abc" maxlength="200" id="b"><br>
        Klucz dostępu: &nbsp&nbsp<input type="password" maxlength="8" class="abc" id="c"><br>
        <div class="but" onclick='edytuj("a")'>Wyślij</div></div>`;
    } else {
        let przedmiot = document.querySelector("#a").value;
        let wpis = document.querySelector("#b").value;
        let haslo = document.querySelector("#c").value;
       
        let s = {
            type: "edytuj",
            przedmiot: przedmiot,
            wpis: wpis,
            id: nowID,
            haslo: haslo
        };
        console.log(s);
        ws.send(JSON.stringify(s));
        pobierz();
    }

}
function usun(a) {
    if (a != "a") {
        nowID = a;
        document.querySelector(".content").innerHTML = `<div class="form">
        Klucz dostępu: &nbsp&nbsp<input type="password" maxlength="8" class="abc" id="c"><br>
        <div class="but" onclick='usun("a")'>Wyślij</div></div>`;
    } else {
        let haslo = document.querySelector("#c").value;
       
        let s = {
            type: "usun",
            id: nowID,
            haslo: haslo
        };
        console.log(s);
        ws.send(JSON.stringify(s));
        pobierz();
    }

}
function dodaj(a) {
    if (a != "a") {
        document.querySelector(".content").innerHTML = `<div class="form">
        Przedmiot:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp <input type="text" maxlength="50" class="abc" id="a"><br>
        Treść zadania: &nbsp&nbsp<input type="text" class="abc" maxlength="200" id="b"><br>
        Data: &nbsp&nbsp<input type="date" class="abc" min="2020-10-01" max="2022-12-31" id="d"><br>
        Klucz dostępu: &nbsp&nbsp<input type="password" maxlength="8" class="abc" id="c"><br>
        <div class="but" onclick='dodaj("a")'>Wyślij</div></div>`;
    } else {
        let przedmiot = document.querySelector("#a").value;
        let wpis = document.querySelector("#b").value;
        let haslo = document.querySelector("#c").value;
        let data = document.querySelector("#d").value;
       
        let s = {
            type: "dodaj",
            przedmiot: przedmiot,
            wpis: wpis,
            data: data,
            haslo: haslo
        };
        console.log(s);
        ws.send(JSON.stringify(s));
        pobierz();
    }

}