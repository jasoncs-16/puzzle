let casilla = document.getElementsByTagName("td");
let longitudCasilla = casilla.length;
const listaImagenes = [];

const listaId = {
    "c1": ["c2","c4"],
    "c2": ["c1","c3","c5"],
    "c3": ["c2","c6"],
    "c4": ["c1","c5","c7"],
    "c5": ["c2","c4","c6","c8"],
    "c6": ["c3","c5","c9"],
    "c7": ["c4","c8"],
    "c8": ["c5","c7","c9"],
    "c9": ["c6","c8"]
};
let revisarEmpezar = false;
let partida = true;
let contador = 1;
let intervaloJuego;

// INICIALIZAR TABLA DE TIEMPOS EN LOCALSTORAGE
function inicializarTablaTiempos() {
    if (!localStorage.getItem("tablaTiempos")) {
        localStorage.setItem("tablaTiempos", JSON.stringify([]));
    }
}

// CARGAR Y MOSTRAR LA TABLA DE TIEMPOS
function cargarTablaTiempos() {
    const tablaTiempos = JSON.parse(localStorage.getItem("tablaTiempos")) || [];
    
    tablaTiempos.sort((a, b) => {
        const tiempoA = convertirTiempoASegundos(a);
        const tiempoB = convertirTiempoASegundos(b);
        return tiempoA - tiempoB;
    });
    
    for (let i = 1; i <= 5; i++) {
        const rangoTiempo = document.getElementById("rank" + i);
        if (rangoTiempo) {
            if (tablaTiempos[i - 1]) {
                rangoTiempo.textContent = tablaTiempos[i - 1];
            } else {
                rangoTiempo.textContent = "--:--";
            }
        }
    }
}

// CONVERTIR FORMATO "MM:SS" A SEGUNDOS TOTALES
function convertirTiempoASegundos(tiempo) {
    const [minutos, segundos] = tiempo.split(":").map(Number);
    return minutos * 60 + segundos;
}

// GUARDAR TIEMPO EN LOCALSTORAGE
function guardarTiempo() {
    const tiempo = document.getElementById("numeroTiempo").innerHTML;
    
    const tablaTiempos = JSON.parse(localStorage.getItem("tablaTiempos")) || [];
    tablaTiempos.push(tiempo);
    
    tablaTiempos.sort((a, b) => {
        const tiempoA = convertirTiempoASegundos(a);
        const tiempoB = convertirTiempoASegundos(b);
        return tiempoA - tiempoB;
    });
    
    const mejoresTiempos = tablaTiempos.slice(0, 5);
    localStorage.setItem("tablaTiempos", JSON.stringify(mejoresTiempos));
    cargarTablaTiempos();
}

// EMPEZAR JUEGO
function empezar() { 
    let auxLista = [...listaImagenes]
    for (let k = 0; k < longitudCasilla - 1; k++) {
        let numeroRandom = Math.floor(Math.random() * auxLista.length);
        
        casilla[k].innerHTML = auxLista[numeroRandom];
        auxLista.splice(numeroRandom, 1);
    }
    document.getElementById("fraseInicio").innerHTML = "¡Que comience el juego!";
    revisarEmpezar = true;
    document.getElementById("start").remove();

    let segundos = 0;
    let minutos = 0;
    intervaloJuego = setInterval(function() {
        segundos++;
        if (segundos >= 60) {
            minutos++;
            segundos = 0;
        }                                                                                   
        document.getElementById("numeroTiempo").innerHTML = minutos.toString().padStart(2, "0")+ ":" + segundos.toString().padStart(2, "0");
    }, 1000);
}

// MOVER IMAGENES
function moverImg(nuevaCasilla) {
    if (revisarEmpezar) {
        if (partida) {
            let locCasillaVacia = "";
            for (let l = 0; l < longitudCasilla; l++) {
                if (casilla[l].innerHTML == "") {
                    locCasillaVacia = casilla[l].id;
                    break;
                }           
            }

            if (locCasillaVacia && listaId[nuevaCasilla] && listaId[nuevaCasilla].includes(locCasillaVacia)) {
                let imagen = document.getElementById(nuevaCasilla).innerHTML;

                document.getElementById(locCasillaVacia).innerHTML = imagen;
                document.getElementById(nuevaCasilla).innerHTML = "";
                document.getElementById("numeroMovimientos").innerHTML = contador++
            }

            let todosCoinciden = true;
            for (let i = 0; i < 8; i++) {
                let contenido = casilla[i].innerHTML;
                let temp = document.createElement("div");
                temp.innerHTML = contenido;
                
                let imagenId = temp.firstElementChild.id;
                console.log(imagenId);
                
                if (!casilla[i].id.includes(imagenId[3])) {
                    todosCoinciden = false;
                    break;
                }
            }

            if (todosCoinciden) {
                document.getElementById("fraseInicio").innerHTML = "¡GANASTE! Resuelto en " + document.getElementById("numeroMovimientos").innerHTML + " movimientos y con un tiempo de " + document.getElementById("numeroTiempo").innerHTML;
                partida = false;
                clearInterval(intervaloJuego);
                
                guardarTiempo(); // Guardar tiempo
            }
        }
    }
}

// CREAR UNA LISTA DE IMAGENES
for (let i = 1; i < longitudCasilla; i++) { 
    listaImagenes.push("<img src='imagenes/img" + i + ".png' id='img" + i + "'>");
}

// CREAR TABLA
for (let j = 0; j < longitudCasilla - 1; j++) {
    casilla[j].innerHTML = listaImagenes[j];
}

for (let n = 0; n < longitudCasilla; n++) {
    casilla[n].addEventListener("click", function() {
        moverImg(this.id);
    });
}

// INICIALIZAR Y CARGAR TABLA DE TIEMPOS AL CARGAR LA PÁGINA
document.addEventListener("DOMContentLoaded", function() {
    inicializarTablaTiempos();
    cargarTablaTiempos();
});

// ASIGNAR EL METODO EMPEZAR AL BOTON DE JUGAR
const botonEmpezar = document.getElementById("start");
botonEmpezar.addEventListener("click", empezar);