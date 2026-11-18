console.log("incidentes.js cargado");
const botonNuevoIncidente = document.querySelector("#nuevo-incidente");
botonNuevoIncidente.addEventListener("click", function(){
    window.location.href = "nuevo-incidente.html";
});

// Marco Normativo
const botonMarcoNormativo = document.querySelector("#marco-normativo");
const modalMarcoNormativo = document.querySelector("#modal-marco-normativo");
const cerrarMarcoNormativo = document.querySelector("#cerrar-marco-normativo");

botonMarcoNormativo.addEventListener("click", function(){
    modalMarcoNormativo.classList.add("active");
});
cerrarMarcoNormativo.addEventListener("click", function (){
    modalMarcoNormativo.classList.remove("active");
});
modalMarcoNormativo.addEventListener("click", function (event){
    if (event.target === modalMarcoNormativo) {
        modalMarcoNormativo.classList.remove("active");
    }
});

// ======================================
// CARGAR INCIDENTES EN LA TABLA
// ======================================

function cargarIncidentes() {

const cuerpoTabla = document.querySelector("#cuerpo-tabla-incidentes");
    if (!cuerpoTabla) return;
const incidentes = JSON.parse(localStorage.getItem("incidentes") || "[]");
    cuerpoTabla.innerHTML = "";
    incidentes.forEach(incidente => {
const informacion = incidente.informacion || {};
const fila = document.createElement("tr");
const datos = [
            incidente.id || "Sin ID",
            informacion.fecha || "Sin fecha",
            informacion.tipoIncidente || "Sin tipo",
            informacion.area || "Sin área",
            informacion.nombreAccidentado || "Sin nombre",
            incidente.estado || "Pendiente",
            "—"
        ];
        datos.forEach(dato => {
const celda = document.createElement("td");
        celda.textContent = dato;
        fila.appendChild(celda);
    });
    cuerpoTabla.appendChild(fila);
});
}

// Ejecutar la carga de incidentes
cargarIncidentes();