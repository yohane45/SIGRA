function obtenerRolUsuario (){
    return sessionStorage.getItem("rolUsuario");
}
function puedeEditar(){
    const rol = obtenerRolUsuario();
    return rol === "Administrador" ||
        rol === "Responsable SST"; 
}
function puedeEliminar(){
    const rol = obtenerRolUsuario();
    return rol === "Administrador" ||
        rol === "Responsable SST";
}
const formularioFiltros = document.querySelector(".filter-form");
const tablaRiesgos = document.querySelector("#tabla-riesgos");

console.log(formularioFiltros);
console.log(tablaRiesgos);

const buscar = document.querySelector("#buscar");
const area = document.querySelector("#area");
const nivel = document.querySelector("#nivel");
const estado = document.querySelector("#estado");

const filasRiesgos = tablaRiesgos.querySelectorAll("tbody tr");
const evaluacionesGuardadas =
    JSON.parse(localStorage.getItem("evaluacionesRiesgos")) || [];
const cuerpoTabla = tablaRiesgos.querySelector("tbody");

function formatearFecha(fecha){
    const fechaObjeto = new Date(fecha);
    return fechaObjeto.toLocaleDateString("es-CO");
}
evaluacionesGuardadas.forEach(function(evaluacion){
    const fila = document.createElement("tr");

    let acciones = `
    <button class="icon-button btn-ver" title="Ver" data-codigo="${evaluacion.codigo}">
        <i class="bi bi-eye"></i>
    </button>
    `;
    if (puedeEditar()){
        acciones += `
            <button class="icon-button" title="Editar">
                <i class="bi bi-pencil-square"></i>
            </button>
        `;
    }
    if (puedeEliminar()){
        acciones +=`
        <button class="icon-button" title="Eliminar">
            <i class="bi bi-trash"></i>
        </button>
        `;
    }
    fila.innerHTML = `
    <td>${evaluacion.codigo}</td>
    <td>
    <strong>${evaluacion.nombre}</strong>
    <span class="peligro-detalle">
        ${evaluacion.tipoPeligro} . ${evaluacion.descripcionPeligro}
        </span>
    </td>
    <td>${evaluacion.area}</td>
    <td>${evaluacion.nivelRiesgo}</td>
    <td>${evaluacion.reportadoPor}</td>
    <td>${formatearFecha(evaluacion.fecha)}</td>
    <td>
        <span class="status-danger">${evaluacion.estado}</span>
    </td>
    <td class="acciones">
        ${acciones}
    </td>
    ;`
    cuerpoTabla.appendChild(fila);
})    

const botonLimpiar = document.querySelector("#limpiar-filtros");
const botonGtc = document.querySelector("#consultar-gtc");
const botonNuevaEvaluacion = document.querySelector("#nueva-evaluacion");

console.log(botonNuevaEvaluacion);

botonNuevaEvaluacion.addEventListener("click", function(){
    window.location.href = "nueva-evaluacion.html";
});

botonGtc.addEventListener("click", function(){
    window.open("../assets/docs/GTC-45-2012.pdf", "_blank");
});


botonLimpiar.addEventListener("click", function(){
    buscar.value = "";
    area.value = "Todas";
    nivel.value = "Todos";
    estado.value = "Todos";
    filasRiesgos.forEach(function(fila){
        fila.style.display = "";
    })
})

formularioFiltros.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const textoBuscar = buscar.value.toLowerCase();
    const valorArea = area.value;
    const valorNivel = nivel.value;
    const valorEstado = estado.value;

    filasRiesgos.forEach(function(fila){

        const celdas = fila.querySelectorAll("td");

        const riesgo = celdas[1].textContent.toLowerCase();
        const areaFila = celdas[2].textContent;
        const nivelFila = celdas[3].textContent;
        const estadoFila = celdas[5].textContent;

        const coincideBusqueda = riesgo.includes(textoBuscar);
        const coincideArea = valorArea === "Todas" || areaFila === valorArea;
        const coincideNivel = valorNivel === "Todos" || nivelFila === valorNivel;
        const coincideEstado = valorEstado === "Todos" || estadoFila === valorEstado;

        const coincide = coincideBusqueda &&
                        coincideArea &&
                        coincideNivel &&
                        coincideEstado;

        fila.style.display = coincide ? "" : "none"
        
    });
});    

document.addEventListener("click", function(event){
    const botonVer = event.target.closest(".btn-ver");
    if (!botonVer){
        return;
    }
    const codigo = botonVer.dataset.codigo;

    console.log("Codigo de avaluacion", codigo);
});