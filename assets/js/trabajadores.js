// ========================================
// GESTIÓN DE TRABAJADORES - SIGRA
// ========================================

// Obtener la tabla
const tablaTrabajadores = document.getElementById('tabla-trabajadores');

// Consultar trabajadores almacenados
function obtenerTrabajadores() {
    return JSON.parse(localStorage.getItem('trabajadores')) || [];
}

// Consultar la vinculacion vigente de cada trabajador
function obtenerVinculacionVigente(idTrabajador) {

    const vinculaciones = JSON.parse(
        localStorage.getItem('vinculaciones')
    ) || [];

    return vinculaciones
        .filter(vinculacion =>
            vinculacion.idTrabajador === idTrabajador &&
            vinculacion.estado === 'Activo'
        )
        .sort((a, b) =>
            new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
        )[0] || null;
}

// Mostrar trabajadores en la tabla
function mostrarTrabajadores() {

    const trabajadores = obtenerTrabajadores();

    tablaTrabajadores.innerHTML = '';

    if (trabajadores.length === 0) {
        tablaTrabajadores.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    No hay trabajadores registrados.
                </td>
            </tr>
        `;
        return;
    }

    trabajadores.forEach(trabajador => {

        // Consultar la vinculacion vigente
        const vinculacion = obtenerVinculacionVigente(
            trabajador.idTrabajador
        );

        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td>${trabajador.tipoDocumento} ${trabajador.documentoIdentidad}</td>
            <td>${trabajador.nombres} ${trabajador.apellidos}</td>
            <td>${vinculacion ? vinculacion.tipoPoblacion : 'Pendiente'}</td>
            <td>${vinculacion ? vinculacion.empresa : 'Pendiente'}</td>
            <td>${vinculacion ? vinculacion.cargo : 'Pendiente'}</td>
            <td>${vinculacion ? vinculacion.area : 'Pendiente'}</td>
            <td>${vinculacion ? vinculacion.estado : 'Pendiente'}</td>
            <td>Sin acciones</td>
        `;

        tablaTrabajadores.appendChild(fila);
    });
}

// Cargar trabajadores al abrir la página
document.addEventListener('DOMContentLoaded', mostrarTrabajadores);

// ========================================
// FILTRAR TRABAJADORES
// ========================================

// Filtrar trabajadores por documento y nombre
function filtrarTrabajadores() {

    const documento = document.getElementById('filtro-documento').value.trim().toLowerCase();
    const nombre = document.getElementById('filtro-nombre').value.trim().toLowerCase();

    const trabajadores = obtenerTrabajadores();

    const resultados = trabajadores.filter(trabajador => {

        const coincideDocumento = trabajador.documentoIdentidad
            .toLowerCase()
            .includes(documento);

        const nombreCompleto = `${trabajador.nombres} ${trabajador.apellidos}`.toLowerCase();

        const coincideNombre = nombreCompleto.includes(nombre);

        return coincideDocumento && coincideNombre;
    });

    tablaTrabajadores.innerHTML = '';

    if (resultados.length === 0) {
        tablaTrabajadores.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    No se encontraron trabajadores.
                </td>
            </tr>
        `;
        return;
    }

    resultados.forEach(trabajador => {

        const vinculacion = obtenerVinculacionVigente(
            trabajador.idTrabajador
        );

        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td>${trabajador.tipoDocumento} ${trabajador.documentoIdentidad}</td>
            <td>${trabajador.nombres} ${trabajador.apellidos}</td>
            <td>${vinculacion ? vinculacion.tipoPoblacion : 'Pendiente'}</td>
            <td>${vinculacion ? vinculacion.empresa : 'Pendiente'}</td>
            <td>${vinculacion ? vinculacion.cargo : 'Pendiente'}</td>
            <td>${vinculacion ? vinculacion.area : 'Pendiente'}</td>
            <td>${vinculacion ? vinculacion.estado : 'Pendiente'}</td>
            <td>Sin acciones</td>
        `;

        tablaTrabajadores.appendChild(fila);
    });
}
// Evento del botón Filtrar
document.getElementById('btn-filtrar').addEventListener('click', filtrarTrabajadores);

// ========================================
// LIMPIAR FILTROS
// ========================================

document.getElementById('btn-limpiar').addEventListener('click', function () {
    document.getElementById('formulario-filtros').reset();
    mostrarTrabajadores();
});

// ========================================
// NAVEGACIÓN: REGISTRAR TRABAJADOR
// ========================================

document.getElementById('registrar-trabajador').addEventListener('click', function () {
    window.location.href = 'nuevo-trabajador.html';
});

// ========================================
// NAVEGACIÓN: GESTIONAR VINCULACIONES
// ========================================

document.getElementById('gestionar-vinculaciones').addEventListener('click', function () {
    window.location.href = 'vinculaciones.html';
});