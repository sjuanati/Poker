/*
const pal = ['piques', 'cors', 'trevols', 'diamants'];
const valor = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
*/

const pal = ['piques', 'cors', 'trevols', 'diamants'];
const valor = ['Q','K','A'];

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
        case '10':  return 9;
        case 'J':   return 10;
        case 'Q':   return 11;
        case 'K':   return 12;
        case 'A':   return 13;
        default:    return 0;
    }
}

/*
    Parella: 2 cartes mateix valor, 3 cartes valors diferents
    Doble Parella: 2 cartes mateix valor + 2 cartes mateix valor, 1 carta diferent
    Poker: 4 cartes iguals, 1 carta diferent
    Full: 3 cartes mateix valor + 2 cartes mateix valor
*/
function comprovaCombinacions(jugador, ma) {
/*
    let comptador = 0;
    let j=0;

    for (let i=0; i<=ma.length; i++) {
        j=i+1;
        while (j < ma.length) {
            if (ma[i].valor === ma[j].valor) {
                comptador++;
            }
            j++;
        }
    }
    if (comptador === 1) {
        console.log(jugador, "Parella: ", true);
    } else if (comptador === 2) {
        console.log(jugador, "Doble Parella: ", true);
    } else if (comptador === 3) {
        console.log(jugador, "Full: ", true);
    } else if (comptador === 4) {
        console.log(jugador, "Poker: ", true);
    }
*/

/*
    var resultat = {};
    valors.forEach(function(element) {
        resultat[element] = (resultat[element] || 0) + 1;
    });

    console.log("Resultat:",resultat)
    for (var element in resultat) {
        console.log(element + ' = ' + resultat[element]);
    } */


    let valors = [];
    for (let i=0; i<ma.length; i++) {
        valors.push(ma[i].valor);
    }

    // Genera array amb cada valor i el seu número de repeticions
    let resultat = {};
    valors.forEach(function(x) { resultat[x] = (resultat[x] || 0) + 1; });
    //console.log(resultat);

    // Count del número les propietats
    let total = Object.keys(resultat).length;

    // EMPAT O NO EMPAT? preguntar-ho.
    for(key in resultat) {
        if(resultat.hasOwnProperty(key)) {
            repeticions = resultat[key];
            if ((total === 2) && ((repeticions === 3) || (repeticions === 2))) {
                console.log(jugador,"-> Full");
                return;
            } else if ((total === 2) && ((repeticions === 4) || (repeticions === 1))) {
                console.log(jugador,"-> Poker");
                return;
            } else if ((total === 3) && (repeticions === 3)) {
                console.log(jugador,"-> Trio");
                return;
            } else if ((total === 3) && (repeticions === 2)) {
                console.log(jugador,"-> Doble Parella");
                return;
            } else if (total === 4) {
                console.log(jugador,"-> Parella");
                return;
            } else if (total === 5) {
                console.log(jugador,"-> Res de res");
                return;
            }
        }
    }




  



}

// 3 cartes mateix valor, 2 cartes diferents
function comprovaTrio() {
}
// 5 cartes consecutives mateix valor
function comprovaEscala() {
}
// 5 cartes mateix pal
function comprovaColor() {

}
// 5 cartes consecutives mateix pal
function comprovaEscalaColor() {

}

function comprovaMans() {
    for (let i=0; i<jugadorsMa.length; i++) {
        comprovaCombinacions(jugadorsMa[i].jugador, jugadorsMa[i].ma);
    }
}

generaBaralla();
generaNumAleatori();
barrejaBaralla();
generaJugadors(2);
reparteixCartes();
comprovaMans();

//console.log(jugadorsMa[0].ma[3].valor);