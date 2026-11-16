let idVinculacionEnEdicion = null;

// ========================================
// CARGAR TRABAJADORES EN EL SELECTOR
// ========================================

function cargarTrabajadores() {
    const selectorTrabajador = document.getElementById('trabajador-vinculacion');
    const trabajadores = JSON.parse(localStorage.getItem('trabajadores')) || [];

    selectorTrabajador.innerHTML = `
        <option value="">Seleccione un trabajador</option>
    `;

    trabajadores.forEach(trabajador => {
        const opcion = document.createElement('option');

        opcion.value = trabajador.idTrabajador;

        opcion.textContent =
            `${trabajador.tipoDocumento} ${trabajador.documentoIdentidad} - ${trabajador.nombres} ${trabajador.apellidos}`;

        selectorTrabajador.appendChild(opcion);
    });

    // Seleccionar automaticamente al trabajador recien registrado
    const idTrabajador = sessionStorage.getItem('trabajadorParaVincular');
    if (idTrabajador){
        selectorTrabajador.value = idTrabajador;

        // Eliminar el identificador temporal despues de seleccionarlo
        sessionStorage.removeItem('trabajadorParaVincular');
    }
}

// ==============================
// GUARDAR UNA NUEVA VINCULACION
// ==============================

function guardarVinculacion(event) {
    event.preventDefault();

    const formulario = document.getElementById('formulario-vinculacion');

    // Obtener los valores del formulario
    const idTrabajador = document.getElementById('trabajador-vinculacion').value;
    const tipoPoblacion = document.getElementById('tipo-poblacion').value;
    const modalidad = document.getElementById('modalidad-vinculacion').value;
    const empresa = document.getElementById('empresa-vinculacion').value.trim();
    const cargo = document.getElementById('cargo-vinculacion').value.trim();
    const area = document.getElementById('area-vinculacion').value.trim();
    const fechaInicio = document.getElementById('fecha-inicio').value;
    const fechaFinalizacion = document.getElementById('fecha-finalizacion').value;
    const estado = document.getElementById('estado-vinculacion').value;

    // validar campos obligatorios
    if (
        !idTrabajador ||
        !tipoPoblacion ||
        !modalidad ||
        !empresa ||
        !cargo ||
        !area ||
        !fechaInicio ||
        !estado
    ){
        alert('Por favor, complete todos los campos obligatorios.');
        return;
    }

    // Validar que el trabajador exista
    const trabajadores = JSON.parse(localStorage.getItem('trabajadores')) || [];

    const trabajadorExiste = trabajadores.some(
        trabajador => trabajador.idTrabajador === idTrabajador
    );

    if (!trabajadorExiste){
        alert('El trabajador seleccionado no se encuentra registrado.');
        return;
    }

    // Recuperar vinculaciones existentes
const vinculaciones = JSON.parse(localStorage.getItem('vinculaciones')) || [];

    // Validar que el trabajador no tenga otra vinculación activa
const vinculacionActiva = vinculaciones.some(registro =>
    registro.idTrabajador === idTrabajador &&
    registro.estado === 'Activo' &&
    registro.idVinculacion !== idVinculacionEnEdicion
);

if (estado === 'Activo' && vinculacionActiva) {
    alert('Este trabajador ya tiene una vinculación activa. Debe inactivar la vinculación anterior antes de registrar una nueva.');
    return;
}

    // Validar fechas
    if (fechaFinalizacion && fechaFinalizacion < fechaInicio) {
        alert('La fecha de finalizacion no puede ser anterior a la fecha de inicio.');
        return;
    }

   // Crear objeto con los datos del formulario
const nuevaVinculacion = {
    idVinculacion: idVinculacionEnEdicion || crypto.randomUUID(),
    idTrabajador: idTrabajador,
    tipoPoblacion: tipoPoblacion,
    modalidad: modalidad,
    empresa: empresa,
    cargo: cargo,
    area: area,
    fechaInicio: fechaInicio,
    fechaFinalizacion: fechaFinalizacion,
    estado: estado,
    fechaCreacion: new Date().toISOString()
};

// Verificar si estamos editando o creando
if (idVinculacionEnEdicion) {

    const indice = vinculaciones.findIndex(
        registro => registro.idVinculacion === idVinculacionEnEdicion
    );

    if (indice !== -1) {
        nuevaVinculacion.fechaCreacion = vinculaciones[indice].fechaCreacion;
        vinculaciones[indice] = nuevaVinculacion;
    }

    alert('La vinculacion se ha actualizado correctamente');

} else {

    vinculaciones.push(nuevaVinculacion);

    alert('La vinculacion se ha registrado correctamente');
}

// Guardar información
localStorage.setItem('vinculaciones', JSON.stringify(vinculaciones));

// Restablecer formulario y modo de edición
formulario.reset();
idVinculacionEnEdicion = null;

document.getElementById('guardar-vinculacion').textContent = 'Guardar Vinculación';

// Actualizar historial
mostrarVinculaciones();
}
// ===================================
// MOSTRAR HISTORIAL DE VINCULACIONES
// ===================================

function mostrarVinculaciones() {
    const tabla = document.getElementById('tabla-vinculaciones');
    const vinculaciones = JSON.parse(localStorage.getItem('vinculaciones')) || [];
    const trabajadores = JSON.parse(localStorage.getItem('trabajadores')) || [];
    tabla.innerHTML = '';
    if (vinculaciones.length === 0){
        tabla.innerHTML = `
            <tr>
                <td colspan="8">No hay vinculaciones registradas.</td>
            </tr>
        `;
        return;
    }

    vinculaciones.forEach(vinculacion => {
        // Buscar trabajdor relacionado
        const trabajador = trabajadores.find(
            persona => persona.idTrabajador === vinculacion.idTrabajador
        );

        const nombreTrabajador = trabajador
        ? `${trabajador.nombres} ${trabajador.apellidos}`
        : 'Trabajador no encontrado';

        const fila = document.createElement('tr');
        const datos = [
            nombreTrabajador,
            vinculacion.empresa,
            vinculacion.cargo,
            vinculacion.area,
            vinculacion.modalidad,
            vinculacion.fechaInicio,
            vinculacion.fechaFinalizacion || 'Sin fecha',
            vinculacion.estado
        ];

        datos.forEach(dato => {
    const celda = document.createElement('td');
    celda.textContent = dato || '-';
    fila.appendChild(celda);
});

// Crear columna de acciones
const celdaAcciones = document.createElement('td');

const botonEditar = document.createElement('button');
botonEditar.textContent = 'Editar';
botonEditar.type = 'button';
botonEditar.classList.add('btn-editar');

botonEditar.addEventListener('click', () => {
    editarVinculacion(vinculacion.idVinculacion);
});

// Agregar botón Editar
celdaAcciones.appendChild(botonEditar);

// Crear botón Inactivar
const botonInactivar = document.createElement('button');

botonInactivar.textContent = 'Inactivar';
botonInactivar.type = 'button';
botonInactivar.classList.add('btn-inactivar');

// Evitar inactivar nuevamente un registro inactivo
if (vinculacion.estado === 'Inactivo') {
    botonInactivar.textContent = 'Inactiva';
    botonInactivar.disabled = true;
} else {
    botonInactivar.addEventListener('click', () => {
        inactivarVinculacion(vinculacion.idVinculacion);
    });
}

celdaAcciones.appendChild(botonInactivar);

fila.appendChild(celdaAcciones);

tabla.appendChild(fila);
    });
}

// ===================================
// EDITAR VINCULACIÓN
// ===================================

function editarVinculacion(idVinculacion) {
    const vinculaciones = JSON.parse(localStorage.getItem('vinculaciones')) || [];

    const vinculacion = vinculaciones.find(
        registro => registro.idVinculacion === idVinculacion
    );

    if (!vinculacion) {
        alert('No se encontró la vinculación seleccionada.');
        return;
    }

    idVinculacionEnEdicion = idVinculacion;

    document.getElementById('trabajador-vinculacion').value = vinculacion.idTrabajador;
    document.getElementById('tipo-poblacion').value = vinculacion.tipoPoblacion;
    document.getElementById('modalidad-vinculacion').value = vinculacion.modalidad;
    document.getElementById('empresa-vinculacion').value = vinculacion.empresa;
    document.getElementById('cargo-vinculacion').value = vinculacion.cargo;
    document.getElementById('area-vinculacion').value = vinculacion.area;
    document.getElementById('fecha-inicio').value = vinculacion.fechaInicio;
    document.getElementById('fecha-finalizacion').value = vinculacion.fechaFinalizacion || '';
    document.getElementById('estado-vinculacion').value = vinculacion.estado;

    document.getElementById('guardar-vinculacion').textContent = 'Actualizar Vinculación';

    document.getElementById('formulario-vinculacion').scrollIntoView({
        behavior: 'smooth'
    });
}

// ===================================
// INACTIVAR VINCULACIÓN
// ===================================

function inactivarVinculacion(idVinculacion) {

    const confirmacion = confirm(
        '¿Está seguro de que desea inactivar esta vinculación?'
    );

    if (!confirmacion) {
        return;
    }

    const vinculaciones = JSON.parse(
        localStorage.getItem('vinculaciones')
    ) || [];

    const indice = vinculaciones.findIndex(
        registro => registro.idVinculacion === idVinculacion
    );

    if (indice === -1) {
        alert('No se encontró la vinculación seleccionada.');
        return;
    }

    vinculaciones[indice].estado = 'Inactivo';
    localStorage.setItem(
        'vinculaciones',
        JSON.stringify(vinculaciones)
    );

    mostrarVinculaciones();
    alert('La vinculación se ha inactivado correctamente.');
}

// =============================
// CANCELAR FORMULARIO
// =============================

function cancelarVinculacion() {
    window.location.href = 'trabajadores.html';

}

// =============================
// INICIALIZAR FUNCIONALIDADES
// =============================

document.addEventListener('DOMContentLoaded', function (){
    cargarTrabajadores();
    // Recuperar y mostar el historial guardado
    mostrarVinculaciones();
    const formulario = document.getElementById('formulario-vinculacion');
    formulario.addEventListener('submit', guardarVinculacion);
    const botonCancelar = document.getElementById('cancelar-vinculacion');
    botonCancelar.addEventListener('click', cancelarVinculacion);
});

