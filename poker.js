
const numJugadors = 4;


const pal = ['piques', 'cors', 'trevols', 'diamants'];
const valor = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

//const pal = ['piques', 'cors', 'trevols', 'diamants'];
//const valor = ['Q','K','A'];

//const pal = ['piques'];
//const valor = ['Q','K','A','J','9','8'];



let baralla = [];
let barrallaBarrejada = [];
let jugadors = [];
//let jugadorsMa = [];
let puntuacions = []

// Genera una baralla de poker amb 52 cartes
function generaBaralla() {

    console.clear();

    for (let i=0; i<pal.length; i++) {
        for (let j=0; j<valor.length; j++) {
            baralla.push({pal: pal[i], valor: valor[j]});
        }
    }
}

// Genera un número aleatori dins d'un rang numèric
function generaNumAleatori(totalMin, totalMax) {

    return Math.floor(Math.random() * (totalMax - totalMin + 1)) + totalMin;
}

// Genera una nova baralla amb les cartes barrejades aleatòriament
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

// Genera els jugadors i reparteix 5 cartes a cadascú
function reparteixBaralla(numJugadors) {

    let ma = [];
    if (numJugadors <= 10) {
        for (let i=1; i<=numJugadors; i++) {
            for (let j=0; j<5; j++) {
                ma.push(barrallaBarrejada.pop());
            }
            jugadors.push({nom: i, ma: ma, score: 0, combi: '' });
            ma = [];
        }
    } else {
        throw new Error("No pot haver més de 10 jugador, i tal.")
    }

    for (let j=0; j<jugadors.length; j++) {
        console.log(jugadors[j])
    }
    
    
}

// Assigna valor a cada carta
function comprovaValor(carta) {
    switch (carta) {
        case '2':   return 2;
        case '3':   return 3;
        case '4':   return 4;
        case '5':   return 5;
        case '6':   return 6;
        case '7':   return 7;
        case '8':   return 8;
        case '9':   return 9;
        case 'J':   return 10;
        case 'Q':   return 11;
        case 'K':   return 12;
        case 'A':   return 13;
        default:    return 0;
    }
}

/*
    Escala Color: 5 cartes consecutives mateix pal -> 800 punts
    Poker: 4 cartes iguals, 1 carta diferent -> 700 punts
    Full: 3 cartes mateix valor + 2 cartes mateix valor -> 600 punts
    Color: 5 cartes mateix pal -> 500 punts
    Escala: 5 cartes consecutives mateix valor -> 400 punts
    Trio: 3 cartes mateix valor, 2 cartes diferents -> 300 punts
    Doble Parella: 2 cartes mateix valor + 2 cartes mateix valor, 1 carta diferent -> 200 punts
    Parella: 2 cartes mateix valor, 3 cartes valors diferents -> 100 punts
*/

function comprovaCombinacions(pos) {
    //jugadors[i].nom, jugadors[i].ma

    // Passa propietats de valors i pals a arrays
    let valors = [], pals = [], valorsEscala = [];
    for (let i=0; i<jugadors[pos].ma.length; i++) {
        valors.push(jugadors[pos].ma[i].valor);
        pals.push(jugadors[pos].ma[i].pal);
        valorsEscala.push(comprovaValor(jugadors[pos].ma[i].valor));
    }

    // Calcula número de repeticions per cada valor / pal
    // Mark: (resultatValors[x] || 0) -> concatenem 0 per evitar sumar NaN + 1 el primer cop, quan encara no s'ha inicialitzat valor 
    let resultatValors = {}, resultatPals = {};
    valors.forEach(function(x) { resultatValors[x] = (resultatValors[x] || 0) + 1; });
    pals.forEach(function(x) { resultatPals[x] = (resultatPals[x] || 0) + 1; });
    
    console.log("resultatValors:",resultatValors)
    console.log("resultatPals:",resultatPals)

    // Count del número les propietats
    let totalValors = Object.keys(resultatValors).length;
    let totalPals = Object.keys(resultatPals).length;

    // Comprova: Parella, Doble Parella, Trio, Full, Poker
    let repeticions = 0;
    for(key in resultatValors) {
        repeticions = resultatValors[key]; // Valor de la clau 'key'
        // Full
        if ((totalValors === 2) && ((repeticions === 3) || (repeticions === 2))) {
            jugadors[pos].score = 600 + calculaValorCombinacio(resultatValors);
            jugadors[pos].combi = "Full";
            return;
        // Poker
        } else if ((totalValors === 2) && ((repeticions === 4) || (repeticions === 1))) {
            jugadors[pos].score = 700 + calculaValorCombinacio(resultatValors);
            jugadors[pos].combi = "Pòquer";
            return;
        // Trio
        } else if ((totalValors === 3) && (repeticions === 3)) {
            jugadors[pos].score = 300 + calculaValorCombinacio(resultatValors);
            jugadors[pos].combi = "Trio";
            return;
        // Doble parella
        } else if ((totalValors === 3) && (repeticions === 2)) {
            jugadors[pos].score = 200 + calculaValorCombinacio(resultatValors);
            jugadors[pos].combi = "Doble Parella";
            return;
        // Parella
        } else if (totalValors === 4) {
            jugadors[pos].score = 100 + calculaValorCombinacio(resultatValors);
            jugadors[pos].combi = "Parella";
            return;
        } 
    }

    // Ordena valors
    valorsEscala.sort(function(a, b){return a - b});

    // Comprova si hi ha algun tipus d'Escala
    let escala = true;
    for (let i=0; i<valorsEscala.length-1; i++) {
        if (valorsEscala[i] !== (valorsEscala[i+1]-1)) {
            escala = false;
        }
    }

    // Escala color
    if ((totalPals === 1) && escala) {
        jugadors[pos].score = 800 + sumaValors(valors);
        jugadors[pos].combi = "Escala color ;)";
        return;
    // Color
    } else if (totalPals === 1) {
        jugadors[pos].score = 500 + sumaValors(valors);
        jugadors[pos].combi = "Color";
        return;
    // Escala
    } else if (escala) {
        jugadors[pos].score = 400 + sumaValors(valors);
        jugadors[pos].combi = "Escala";
        return;
    // Cap combinació
    } else {
        jugadors[pos].score = sumaValors(valors)
        jugadors[pos].combi = "";
        return;
    }
}

// Calcula el valor de cada combinació
function calculaValorCombinacio(resultatValors) {
    let result = 0;
    for (const [key, value] of Object.entries(resultatValors)) {
        if (value > 1) {
            result += comprovaValor(key) * value;
        }
    }
    return result;
}

// Suma el valor de totes les cartes (per quan hi ha escala o cap combinació)
function sumaValors(valors) {
    let resultat = 0;
    valors.forEach(function(x) {
        resultat += comprovaValor(x);
    })
    return resultat;
}

function comprovaMans() {
    for (let i=0; i<jugadors.length; i++) {
        comprovaCombinacions(i);
    }
}

function mostraResultats() {
    for (let i=0; i<jugadors.length; i++) {
        console.log("Jugador",(i+1),"-> Puntuació: ",jugadors[i].score,jugadors[i].combi);
    }
}

function mostraGuanyador() {
    let resultat = Math.max.apply(Math, jugadors.map(function(o) { return o.score; }));

    let guanyador = jugadors.filter(obj => {
        return obj.score === resultat
      })
      console.log("\nEl guanyador és: Jugador",guanyador[0].nom)
}

generaBaralla();
generaNumAleatori();
barrejaBaralla();
reparteixBaralla(numJugadors);
comprovaMans();
mostraResultats();
mostraGuanyador();

