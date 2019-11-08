
const pal = ['piques', 'cors', 'trevols', 'diamants'];
const valor = ['as', 'dos', 'tres', 'quatre', 'cinc', 'sis', 'set', 'vuit', 'nou', 'deu', 'sota', 'cavall', 'rei'];
const totalMin = 1;
let totalMax = 0;
let baralla = [];
let barrallaBarrejada = [];
let jugadors = [];
let jugadorsMa = [];

function valorPunts(carta) {
    switch (carta) {
        case 'dos': return 1;
        case 'tres': return 2;
        case 'quatre': return 3;
        case 'cinc': return 4;
        case 'sis': return 5;
        case 'set': return 6;
        case 'vuit': return 7;
        case 'nou': return 8;
        case 'deu': return 9;
        case 'sota': return 10;
        case 'cavall': return 11;
        case 'rei': return 12;
        case 'as': return 13;
        default: return 0;
    }
}

function generaBaralla() {
    for (let i=0; i<pal.length; i++) {
        for (let j=0; j<valor.length; j++) {
            baralla.push({pal: pal[i], valor: valor[j]});
            console.log("valor: ",valor[j]," score: ",valorPunts(valor[j]));
        }
    }
    totalMax = baralla.length;
}

function generaNumAleatori() {
    return Math.floor(Math.random() * (totalMax - totalMin + 1)) + totalMin;
}

function barrejaBaralla() {
    for (let i=0; i<baralla.length; i++) {
        let indexAleatori = generaNumAleatori();
        barrallaBarrejada.push(baralla[indexAleatori]);
    }
    //console.log(barrallaBarrejada);
}

function generaJugadors(numJugadors) {
    for (let i=1; i<=numJugadors; i++) {
        jugadors.push(`jugador${i}`);
    }
    //console.log(jugadors);
}

function reparteixCartes() {
    let ma = [];
    for (let i=0; i<jugadors.length; i++) {
        for (let j=0; j<5; j++) {
            let indexAleatori = generaNumAleatori();
            ma.push(barrallaBarrejada[indexAleatori]);
            barrallaBarrejada.splice(indexAleatori,1);
            totalMax--;

        }
        jugadorsMa.push({jugador: jugadors[i], ma: ma });
        ma = [];
        console.log(jugadorsMa[i]);
    }
    
}

generaBaralla();
generaNumAleatori();
barrejaBaralla();
generaJugadors(2);
reparteixCartes();