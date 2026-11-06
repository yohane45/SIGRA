// ========================================
// CARGAR TRABAJADORES REGISTRADOS
// ========================================

function cargarTrabajadores() {

    const selectorTrabajador = document.getElementById('trabajador-vinculacion');

    // Consultar trabajadores almacenados
    const trabajadores = JSON.parse(localStorage.getItem('trabajadores')) || [];

    // Limpiar opciones anteriores
    selectorTrabajador.innerHTML = `
        <option value="">Seleccione un trabajador</option>
    `;

    // Recorrer los trabajadores registrados
    trabajadores.forEach(trabajador => {

        const opcion = document.createElement('option');

        opcion.value = trabajador.idTrabajador;

        opcion.textContent =
            `${trabajador.tipoDocumento} ${trabajador.documentoIdentidad} - ${trabajador.nombres} ${trabajador.apellidos}`;

        selectorTrabajador.appendChild(opcion);

    });

}

// Cargar trabajadores al abrir la página
document.addEventListener('DOMContentLoaded', cargarTrabajadores);

