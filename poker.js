
// Variables globals de baralla i jugadors
const pal = ['piques', 'cors', 'trèvols', 'diamants'];
const valor = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const nomJugadors = ["Sergi", "Marta", "Albert"];
let baralla = [];
let barrallaBarrejada = [];
let jugadors = [];

// Genera una baralla de pòquer amb 52 cartes
const generaBaralla = () => {

    pal.forEach(elemPal => {
        valor.forEach(elemValor => {
            baralla.push({pal: elemPal, valor: elemValor});
        })
    })
}

// Genera un número aleatori dins d'un rang numèric
const generaNumAleatori = (totalMin, totalMax) => {

    return Math.floor(Math.random() * (totalMax - totalMin + 1)) + totalMin;
}

// Genera una nova baralla amb les cartes barrejades aleatòriament
const barrejaBaralla = () => {

    let max = baralla.length;
    if (max > 0) {
        let index = generaNumAleatori(0, max-1);
        barrallaBarrejada.push(baralla[index]);
        baralla.splice(index, 1);
        barrejaBaralla();
    }
}

// Reparteix 5 cartes a cada jugador
const reparteixBaralla = () => {

    // Assigna les cartes
    let ma = [];
    if ((barrallaBarrejada.length / 5) >= nomJugadors.length) {
        nomJugadors.forEach(nom => {
            [1,2,3,4,5].forEach(elem => {
                ma.push(barrallaBarrejada.pop());
            })
            jugadors.push({nom: nom, ma: ma, score: 0, combi: '', desempat: [] });
            ma = [];
        })
    } else {
        throw new Error("No hi ha prou cartes a repartir, i tal.")
    }

    // Mostra la mà de cada jugador
    jugadors.forEach(elem => {
        console.log("Jugador", elem.nom)
        elem.ma.forEach(ma => {
            console.log("  ", ma.valor, ma.pal)
        })
        console.log("-----------------\n")
    })
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
    '10': 10,
    'J': 11,
    'Q': 12,
    'K': 13,
    'A': 14,
})[carta] || 0;

/*
    Classificació de les mans del pòquer:
    Escala Color: 5 cartes consecutives mateix pal -> 800 punts
    Pòquer: 4 cartes iguals, 1 carta diferent -> 700 punts
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
    jugadors[pos].ma.forEach(elem => {
        valors.push(elem.valor);
        pals.push(elem.pal);
        valorsEscala.push(valorCarta(elem.valor));
    })

    // Calcula número de repeticions per cada valor i pal
    // Mark: (resultatValors[x] || 0) -> concatenem 0 per evitar sumar NaN + 1 el primer cop quan encara no s'ha inicialitzat valor 
    let resultatValors = {}, resultatPals = {};
    valors.forEach(x => { resultatValors[x] = (resultatValors[x] || 0) + 1; });
    pals.forEach(x => { resultatPals[x] = (resultatPals[x] || 0) + 1; });

    // Guarda tots els valors que no tinguin cap combinació (per després poder desempatar)
    jugadors[pos].desempat = calculaValorCombinacio(resultatValors)[1];

    // Count del número de propietats
    let totalValors = Object.keys(resultatValors).length;
    let totalPals = Object.keys(resultatPals).length;

    // Comprova: Parella, Doble Parella, Trio, Full, Pòquer
    let repeticions = 0;
    for(key in resultatValors) {
        repeticions = resultatValors[key]; // Valor de la clau 'key'
        // Full
        if ((totalValors === 2) && ((repeticions === 3) || (repeticions === 2))) {
            jugadors[pos].score = 600 + calculaValorCombinacio(resultatValors)[0];
            jugadors[pos].combi = "Full";
            return;
        // Pòquer
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

    // Ordena valors de menor a major
    valorsEscala.sort((a, b) => {return a - b});

    // Comprova si hi ha algun tipus d'Escala
    // TODO : cas 5-4-3-2-A
    let escala = true;
    valorsEscala.forEach((elem, i) => {
        if ((valorsEscala[i] !== valorsEscala[i+1] - 1) && (i < 4)) {
            escala = false;
        }
    })

    // Escala color
    if ((totalPals === 1) && escala) {
        jugadors[pos].score = 800 + sumaValors(valors);
        jugadors[pos].combi = "Escala de color ;)";
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

// Suma el valor de les combinacions / Guarda el valor de les cartes que no tenen cap combinació (per desempatar)
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
    return [sumaCombinacions, sumaDesempat];
}

// Suma el valor de totes les cartes (per quan hi ha escala o cap combinació)
const sumaValors = (valors) => {

    let resultat = 0;
    valors.forEach( x => {
        resultat += valorCarta(x);
    })
    return resultat;
}


// Mostra puntuació de cada jugador
const mostraResultats = () => {

    jugadors.forEach((elem, index) => {
        comprovaCombinacions(index);
        console.log(elem.nom,"-> Puntuació: ", elem.score, elem.combi);
    })
}

// Mostra el jugador guanyador de la partida
const mostraGuanyador = () => {

    // Obté la puntuació més alta
    let resultat = Math.max.apply(Math, jugadors.map(x => { return x.score; }));
    
    // Busca empats de puntuació
    let guanyadorsRepetits = {}
    jugadors.forEach(elem => {
        guanyadorsRepetits[elem.score] = (guanyadorsRepetits[elem.score] || 0) + 1
    })

    // Busca si hi ha més de 2 persones amb la màxima puntuació
    for (const [key, value] of Object.entries(guanyadorsRepetits)) {
        if ((value > 1) && (Number(key) === resultat)) {
            // TODO: Funció per desempatar. Per mitjà de <jugadors.desempat>, falta mirar recursivament la següent carta més alta.
            // MARK: Tanmateix, es tracta d'una versió de pòquer de bar.
            console.log("\nHi ha un empat! El primer que s'acabi la birra sencera, guanya!\n")
            return;
        }
    }

    // Tria el jugador amb el valor més alt
    let guanyador = jugadors.filter(obj => {
        return obj.score === resultat
    })
    console.log("\nEl guanyador és: ",guanyador[0].nom,"\n")
}


// Execució principal
console.clear();
generaBaralla();
barrejaBaralla();
reparteixBaralla();
mostraResultats();
mostraGuanyador();
