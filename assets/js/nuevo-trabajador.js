// ==============================
// REGISTRO DE TRABAJADORES - SIGRA
// ==============================

// Obtener el formulario
const formularioTrabajador = document.getElementById('formulario-trabajador');

// Escuchar el envío del formulario
formularioTrabajador.addEventListener('submit', function (evento) {

    evento.preventDefault();

    // Obtener los datos del formulario
    const tipoDocumento = document.getElementById('tipo-documento').value;
    const documentoIdentidad = document.getElementById('numero-documento').value.trim();
    const nombres = document.getElementById('nombres-trabajador').value.trim();
    const apellidos = document.getElementById('apellidos-trabajador').value.trim();

    // Verificar que todos los campos estén diligenciados
    if (!tipoDocumento || !documentoIdentidad || !nombres || !apellidos) {
        alert('Por favor, complete todos los campos obligatorios.');
        return;
    }

    // Consultar trabajadores almacenados
    const trabajadores = JSON.parse(localStorage.getItem('trabajadores')) || [];

    // Verificar si el documento ya está registrado
    const trabajadorExistente = trabajadores.find(trabajador =>
        trabajador.tipoDocumento === tipoDocumento &&
        trabajador.documentoIdentidad === documentoIdentidad
    );

    if (trabajadorExistente) {
        alert('Ya existe un trabajador registrado con ese tipo y número de documento.');
        return;
    }

    // Crear el registro del trabajador
    const nuevoTrabajador = {
        idTrabajador: crypto.randomUUID(),
        tipoDocumento: tipoDocumento,
        documentoIdentidad: documentoIdentidad,
        nombres: nombres,
        apellidos: apellidos,
        fechaCreacion: new Date().toISOString()
    };

    // Guardar el trabajador en localStorage
    trabajadores.push(nuevoTrabajador);

    localStorage.setItem('trabajadores', JSON.stringify(trabajadores));

    // Confirmar el registro
    alert('¡Trabajador registrado exitosamente!');

    // Limpiar el formulario
    formularioTrabajador.reset();

});

// ========================================
// CANCELAR REGISTRO DE TRABAJADOR
// ========================================

const botonCancelar = document.getElementById('cancelar-trabajador');
botonCancelar.addEventListener('click', function () {
    window.location.href = 'trabajadores.html';

});