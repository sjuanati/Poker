const numJugadors = 2;

const pal = ['piques', 'cors', 'trevols', 'diamants'];
const valor = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

//const pal = ['piques', 'cors', 'trevols', 'diamants'];
//const valor = ['Q','K','A'];

//const pal = ['piques'];
//const valor = ['Q','K','A','J','9','8'];

let baralla = [];
let barrallaBarrejada = [];
let jugadors = [];

// Genera una baralla de poker amb 52 cartes
const generaBaralla = () => {

    console.clear();

    for (let i=0; i<pal.length; i++) {
        for (let j=0; j<valor.length; j++) {
            baralla.push({pal: pal[i], valor: valor[j]});
        }
    }
}

// Genera un número aleatori dins d'un rang numèric
const generaNumAleatori = (totalMin, totalMax) => {

    return Math.floor(Math.random() * (totalMax - totalMin + 1)) + totalMin;
}

// Genera una nova baralla amb les cartes barrejades aleatòriament
const barrejaBaralla = () => {

    let totalMax = baralla.length;
    let currentMax = totalMax;
    let indexAleatori = 0;

    for (let i=0; i<totalMax; i++) {
        indexAleatori = generaNumAleatori(0,currentMax-1);
        barrallaBarrejada.push(baralla[indexAleatori]);
        baralla.splice(indexAleatori,1);
        currentMax--;
    }
}

// Genera els jugadors i reparteix 5 cartes a cadascú
const reparteixBaralla = (numJugadors) => {

    let ma = [];
    if (numJugadors <= 10) {
        for (let i=1; i<=numJugadors; i++) {
            for (let j=0; j<5; j++) {
                ma.push(barrallaBarrejada.pop());
            }
            jugadors.push({nom: i, ma: ma, score: 0, combi: '', desempat: [] });
            ma = [];
        }
    } else {
        throw new Error("No pot haver més de 10 jugador, i tal.")
    }

    for (let j=0; j<jugadors.length; j++) {
        console.log("Jugador",jugadors[j].nom)
        console.log(jugadors[j].ma)
    }
    

    // Per provar l'empat 
    /*
   jugadors.push({nom: 1, ma: [{pal: 'diamants', valor: 'A'},{pal: 'diamants', valor: 'A'},{pal: 'diamants', valor: 'A'},{pal: 'diamants', valor: 'A'},{pal: 'ors', valor: '2'}], score: 0, combi: '', desempat: [] });
   jugadors.push({nom: 1, ma: [{pal: 'diamants', valor: 'A'},{pal: 'diamants', valor: 'A'},{pal: 'diamants', valor: 'A'},{pal: 'diamants', valor: 'A'},{pal: 'ors', valor: '3'}], score: 0, combi: '', desempat: [] });
   for (let j=0; j<jugadors.length; j++) {
        console.log("Jugador",jugadors[j].nom)
        console.log(jugadors[j].ma)
    }
    */

}

// Assigna valor a cada carta
const valorCarta = (carta) => ({
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        'J': 10,
        'Q': 11,
        'K': 12,
        'A': 13,
})[carta] || 0;


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

const comprovaCombinacions = (pos) => {

    // Passa propietats de valors i pals a arrays
    let valors = [], pals = [], valorsEscala = [];
    for (let i=0; i<jugadors[pos].ma.length; i++) {
        valors.push(jugadors[pos].ma[i].valor);
        pals.push(jugadors[pos].ma[i].pal);
        valorsEscala.push(valorCarta(jugadors[pos].ma[i].valor));
    }

    // Calcula número de repeticions per cada valor / pal
    // Mark: (resultatValors[x] || 0) -> concatenem 0 per evitar sumar NaN + 1 el primer cop, quan encara no s'ha inicialitzat valor 
    let resultatValors = {}, resultatPals = {};
    valors.forEach(function(x) { resultatValors[x] = (resultatValors[x] || 0) + 1; });
    pals.forEach(function(x) { resultatPals[x] = (resultatPals[x] || 0) + 1; });

    console.log(resultatValors)
    console.log(resultatPals)

    jugadors[pos].desempat = calculaValorCombinacio(resultatValors)[1];

    // Count del número les propietats
    let totalValors = Object.keys(resultatValors).length;
    let totalPals = Object.keys(resultatPals).length;

    // Comprova: Parella, Doble Parella, Trio, Full, Poker
    let repeticions = 0;
    for(key in resultatValors) {
        repeticions = resultatValors[key]; // Valor de la clau 'key'
        // Full
        if ((totalValors === 2) && ((repeticions === 3) || (repeticions === 2))) {
            jugadors[pos].score = 600 + calculaValorCombinacio(resultatValors)[0];
            jugadors[pos].combi = "Full";
            return;
        // Poker
        } else if ((totalValors === 2) && ((repeticions === 4) || (repeticions === 1))) {
            jugadors[pos].score = 700 + calculaValorCombinacio(resultatValors)[0];
            jugadors[pos].combi = "Pòquer";
            return;
        // Trio
        } else if ((totalValors === 3) && (repeticions === 3)) {
            jugadors[pos].score = 300 + calculaValorCombinacio(resultatValors)[0];
            jugadors[pos].combi = "Trio";
            return;
        // Doble parella
        } else if ((totalValors === 3) && (repeticions === 2)) {
            jugadors[pos].score = 200 + calculaValorCombinacio(resultatValors)[0];
            jugadors[pos].combi = "Doble Parella";
            return;
        // Parella
        } else if (totalValors === 4) {
            jugadors[pos].score = 100 + calculaValorCombinacio(resultatValors)[0];
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

const calculaValorCombinacio = (resultatValors) => {

    let sumaCombinacions = 0;
    let sumaDesempat = [];
    for (const [key, value] of Object.entries(resultatValors)) {
        if (value > 1) {
            sumaCombinacions += valorCarta(key) * value;
        } else {
            sumaDesempat.push(valorCarta(key));
        }
    }
    return [sumaCombinacions,sumaDesempat];
}

// Suma el valor de totes les cartes (per quan hi ha escala o cap combinació)
const sumaValors = (valors) => {

    let resultat = 0;
    valors.forEach(function(x) {
        resultat += valorCarta(x);
    })
    return resultat;
}

const comprovaMans = () => {

    for (let i=0; i<jugadors.length; i++) {
        comprovaCombinacions(i);
    }
}

const mostraResultats = () => {

    for (let i=0; i<jugadors.length; i++) {
        console.log("Jugador",(i+1),"-> Puntuació: ",jugadors[i].score,jugadors[i].combi);
    }
}

const mostraGuanyador = () => {

    // Obté la puntuació més alta
    let resultat = Math.max.apply(Math, jugadors.map(function(o) { return o.score; }));
    
    // Busca empats de puntuació
    let guanyadorsRepetits = {}
    jugadors.forEach(function(obj) {
        var key = obj.score
        guanyadorsRepetits[key] = (guanyadorsRepetits[key] || 0) + 1
    })
    console.log("repes:",guanyadorsRepetits);  // ex: repes: { '248': 1, '256': 3 }

    // Buscar si hi ha més de 2 persones amb la màxima puntuació
    for (const [key, value] of Object.entries(guanyadorsRepetits)) {
        if ((value > 1) && (Number(key) === resultat)) {
            console.log("\nEmpat!")
            buscaDesempat(0, 0, [], resultat);
            return;
        }
    }


    // Tria el jugador amb el valor més alt
    let guanyador = jugadors.filter(obj => {
        return obj.score === resultat
      })

    console.log(jugadors)
    console.log("\nEl guanyador és: Jugador",guanyador[0].nom)
}

const buscaDesempat = (posicioDesempat, darrerNumMaxim, candidats, resultat) => {

        // TODO: per tots aquell jugadors amb màxima puntuació, mirar el seu array de desempat ordenat,
    // guanyarà qui tingui la segona,tercera,... carta més alta.

    let pos = 0;
    jugadors.forEach(function(obj) {
        let score = obj.score;
        let desempat = obj.desempat;
        console.log("Number(score):",Number(score),"resultat:",resultat,"desempat[posicioDesempat]",desempat[posicioDesempat],"darrerNumMaxim",darrerNumMaxim)
        if ((Number(score) === resultat) && (desempat[posicioDesempat] >= darrerNumMaxim)) {
            darrerNumMaxim = desempat[posicioDesempat];
            candidats.push(pos);
        }
        pos++;
    })

    if (candidats.length === 1) {
        console.log("\nEl guanyador és: Jugador",jugadors[candidats[0]].nom);
    }

}


// Execució principal
generaBaralla();
barrejaBaralla();
reparteixBaralla(numJugadors);
comprovaMans();
mostraResultats();
mostraGuanyador();
