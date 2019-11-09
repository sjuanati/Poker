
const pal = ['piques', 'cors', 'trevols', 'diamants'];
const valor = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

/*
const pal = ['piques', 'cors', 'trevols', 'diamants'];
const valor = ['Q','K','A'];

const pal = ['piques'];
const valor = ['Q','K','A','J','9','8'];
*/

//const totalMin = 1;
//let totalMax = 0;
let baralla = [];
let barrallaBarrejada = [];
let jugadors = [];
let jugadorsMa = [];

function generaBaralla() {

    for (let i=0; i<pal.length; i++) {
        for (let j=0; j<valor.length; j++) {
            baralla.push({pal: pal[i], valor: valor[j]});
        }
    }
}

function generaNumAleatori(totalMin, totalMax) {

    return Math.floor(Math.random() * (totalMax - totalMin + 1)) + totalMin;
}

function barrejaBaralla() {

    let totalMax = baralla.length;
    let currentMax = totalMax;
    for (let i=0; i<totalMax; i++) {
        let indexAleatori = generaNumAleatori(0,currentMax-1);
        barrallaBarrejada.push(baralla[indexAleatori]);
        baralla.splice(indexAleatori,1);
        currentMax--;
    }
}

function generaJugadors(numJugadors) {

    for (let i=1; i<=numJugadors; i++) {
        jugadors.push(`jugador${i}`);
    }
}

function reparteixCartes() {
    
    let ma = [];
    for (let i=0; i<jugadors.length; i++) {
        for (let j=0; j<5; j++) {
            ma.push(barrallaBarrejada.pop());
        }
        jugadorsMa.push({jugador: jugadors[i], ma: ma });
        ma = [];
        console.log(jugadorsMa[i]);
    }
}

// valor de la carta
function comprovaValor(carta) {
    switch (carta) {
        case '2':   return 1;
        case '3':   return 2;
        case '4':   return 3;
        case '5':   return 4;
        case '6':   return 5;
        case '7':   return 6;
        case '8':   return 7;
        case '9':   return 8;
        case 'J':   return 9;
        case 'Q':   return 10;
        case 'K':   return 11;
        case 'A':   return 12;
        default:    return 0;
    }
}

/*
    Parella: 2 cartes mateix valor, 3 cartes valors diferents
    Doble Parella: 2 cartes mateix valor + 2 cartes mateix valor, 1 carta diferent
    Trio: 3 cartes mateix valor, 2 cartes diferents
    Poker: 4 cartes iguals, 1 carta diferent
    Full: 3 cartes mateix valor + 2 cartes mateix valor
    Escala: 5 cartes consecutives mateix valor
    Color: 5 cartes mateix pal
    Escala Color: 5 cartes consecutives mateix pal
*/
function comprovaCombinacions(jugador, ma) {

    // Passa propietats de valors i pals a arrays
    let valors = [], pals = [], valorsEscala = [];
    for (let i=0; i<ma.length; i++) {
        valors.push(ma[i].valor);
        pals.push(ma[i].pal);
        valorsEscala.push(comprovaValor(ma[i].valor));
    }

    // Calcula número de repeticions per cada valor / pal
    let resultatValors = {}, resultatPals = {};
    valors.forEach(function(x) { resultatValors[x] = (resultatValors[x] || 0) + 1; });
    pals.forEach(function(x) { resultatPals[x] = (resultatPals[x] || 0) + 1; });

    // Count del número les propietats
    let totalValors = Object.keys(resultatValors).length;
    let totalPals = Object.keys(resultatPals).length;

    // Comprova: Parella, Doble Parella, Trio, Full, Poker
    let repeticions = 0;
    for(key in resultatValors) {
        if(resultatValors.hasOwnProperty(key)) {
            repeticions = resultatValors[key];
            if ((totalValors === 2) && ((repeticions === 3) || (repeticions === 2))) {
                console.log(jugador,"-> Full");
                return;
            } else if ((totalValors === 2) && ((repeticions === 4) || (repeticions === 1))) {
                console.log(jugador,"-> Poker");
                return;
            } else if ((totalValors === 3) && (repeticions === 3)) {
                console.log(jugador,"-> Trio");
                return;
            } else if ((totalValors === 3) && (repeticions === 2)) {
                console.log(jugador,"-> Doble Parella");
                return;
            } else if (totalValors === 4) {
                console.log(jugador,"-> Parella");
                return;
            } 
        }
    }

    // Ordena valors
    valorsEscala.sort(function(a, b){return a - b});

    // Comprova: Escala
    let escala = true;
    for (let i=0; i<valorsEscala.length-1; i++) {
        if (valorsEscala[i] !== (valorsEscala[i+1]-1)) {
            escala = false;
        }
    }

    // Comprova: Color
    if ((totalPals === 1) && escala) {
        console.log(jugador,"-> Escala color ;)");
        return;
    } else if (totalPals === 1) {
        console.log(jugador,"-> Color");
        return;
    } else if (escala) {
        console.log(jugador,"-> Escala");
        return;
    } else {
        console.log(jugador,"-> Res de res");
        return;
    }
}

function comprovaMans() {
    for (let i=0; i<jugadorsMa.length; i++) {
        comprovaCombinacions(jugadorsMa[i].jugador, jugadorsMa[i].ma);
    }
}

generaBaralla();
generaNumAleatori();
barrejaBaralla();
generaJugadors(3);
reparteixCartes();
comprovaMans();

//console.log(jugadorsMa[0].ma[3].valor);