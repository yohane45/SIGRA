const botonMarcoNormativo = document.querySelector("#marco-normativo");
const modalMarcoNormativo = document.querySelector("#modal-marco-normativo");
const cerrarMarcoNormativo = document.querySelector("#cerrar-marco-normativo");
const botonNuevaInspeccion = document.querySelector("#nueva-inspeccion");

botonNuevaInspeccion.addEventListener("click", function(){
    window.location.href = "nueva-inspeccion.html";
});

botonMarcoNormativo.addEventListener("click", function(){
    modalMarcoNormativo.classList.add("active");
});
cerrarMarcoNormativo.addEventListener("click",function(){
    modalMarcoNormativo.classList.remove("active");
});
modalMarcoNormativo.addEventListener("click", function(evento){
    if (evento.target === modalMarcoNormativo){
        modalMarcoNormativo.classList.remove("active");
    }
});
// Cargar inspecciones guardadas
const inspeccionesGuardadas = 
    JSON.parse(localStorage.getItem("inspecciones")) || [];
const tablaInspecciones = 
    document.querySelector("#tabla-inspecciones tbody");
inspeccionesGuardadas.forEach(function(inspecciones){
    const fila = document.createElement("tr");
    fila.innerHTML = `
        <td>${inspecciones.id}</td>
        <td>${inspecciones.fecha}</td>
        <td>${inspecciones.tipo}</td>
        <td>${inspecciones.area}</td>
        <td>${inspecciones.responsable}</td>
        <td>
            <span class="status-danger">${inspecciones.estado}</span>
        </td>
        <td class="actions">
            <button class="icon-button" title="Ver">
                <i class="bi bi-eye"></i>
            </button>
            <button class="icon-button" title="Editar">
                <i class="bi bi-pencil-square"></i>
            </button>
            <button class="icon-button" title="Eliminar">
                <i class="bi bi-trash"></i>
                </button>
            </td>
            `;
            tablaInspecciones.appendChild(fila);
});        

