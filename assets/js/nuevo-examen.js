const formularioExamen = document.getElementById("form-nuevo-examen");
const cancelarExamen = document.getElementById("cancelar-examen");

// Cancelar
cancelarExamen.addEventListener("click", function () {
    window.location.href = "medica.html";
});

// Guardar examen
formularioExamen.addEventListener("submit", function (event) {
    event.preventDefault();

    // Validar campos obligatorios
if (
    !document.getElementById("nombres-apellidos").value.trim() ||
    !document.getElementById("documento-identidad").value.trim() ||
    !document.getElementById("cargo-oficio").value.trim() ||
    !document.getElementById("area-seccion-sede").value.trim() ||
    !document.getElementById("tipo-examen").value ||
    !document.getElementById("fecha-examen").value ||
    !document.getElementById("centro-medico").value.trim() ||
    !document.getElementById("concepto-aptitud").value ||
    !document.getElementById("estado-seguimiento").value
) {
    alert("Por favor, complete todos los campos obligatorios.");
    return;
}

    // Obtener los datos del formulario
    const nuevoExamen = {
        nombresApellidos: document.getElementById("nombres-apellidos").value.trim(),
        documentoIdentidad: document.getElementById("documento-identidad").value.trim(),
        cargoOficio: document.getElementById("cargo-oficio").value.trim(),
        areaSeccionSede: document.getElementById("area-seccion-sede").value.trim(),

        tipoExamen: document.getElementById("tipo-examen").value,
        fechaExamen: document.getElementById("fecha-examen").value,
        centroMedico: document.getElementById("centro-medico").value.trim(),

        conceptoAptitud: document.getElementById("concepto-aptitud").value,
        restriccionesRecomendaciones:
            document.getElementById("restricciones-recomendaciones").value.trim(),
        fechaProximoControl:
            document.getElementById("fecha-proximo-control").value,
        estadoSeguimiento:
            document.getElementById("estado-seguimiento").value
    };

    // Obtener el archivo
    const archivoInput = document.getElementById("archivo-examen");

    if (archivoInput.files.length > 0) {
        nuevoExamen.archivo = archivoInput.files[0].name;
    } else {
        nuevoExamen.archivo = "";
    }

    // Obtener exámenes existentes
    const examenesGuardados =
        JSON.parse(localStorage.getItem("examenesMedicos")) || [];

    // Generar ID automático
    const numero = examenesGuardados.length + 1;

    nuevoExamen.id = `EXM-${String(numero).padStart(3, "0")}`;

    // Guardar el nuevo examen
    examenesGuardados.push(nuevoExamen);

    localStorage.setItem(
        "examenesMedicos",
        JSON.stringify(examenesGuardados)
    );

    // Confirmación
    alert(`Examen médico ${nuevoExamen.id} guardado correctamente.`);

    // Regresar a Gestión Médica
    window.location.href = "medica.html";
});