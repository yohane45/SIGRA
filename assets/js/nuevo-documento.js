// =========================================
// NUEVO DOCUMENTO
// =========================================

// Elementos del formulario
const formularioDocumento = document.getElementById("form-nuevo-documento");
const cancelarDocumento = document.getElementById("cancelar-documento");
const archivoDocumento = document.getElementById("archivo-documento");

// =========================================
// CANCELAR
// =========================================

cancelarDocumento.addEventListener("click", function () {
    window.location.href = "documental.html";
});

// =========================================
// GUARDAR DOCUMENTO
// =========================================

formularioDocumento.addEventListener("submit", function (event) {
    event.preventDefault();

    // Obtener valores
    const nombre = document.getElementById("nombre-documento").value.trim();
    const tipo = document.getElementById("tipo-documento").value;
    const area = document.getElementById("area-documento").value;
    const version = document.getElementById("version-documento").value.trim();
    const fecha = document.getElementById("fecha-carga-documento").value;
    const estado = document.getElementById("estado-documento").value;
    const descripcion = document.getElementById("descripcion-documento").value.trim();

    // =========================================
    // VALIDACIÓN DE CAMPOS
    // =========================================

    if (
        !nombre ||
        !tipo ||
        !area ||
        !version ||
        !fecha ||
        !estado ||
        !descripcion
    ) {
        alert("Por favor, complete todos los campos obligatorios.");
        return;
    }

    // =========================================
    // VALIDACIÓN DEL ARCHIVO
    // =========================================

    if (!archivoDocumento.files.length) {
        alert("Debe seleccionar un documento para cargar.");
        return;
    }

    const archivo = archivoDocumento.files[0];
    const nombreArchivo = archivo.name;
    const extension = nombreArchivo
        .substring(nombreArchivo.lastIndexOf("."))
        .toLowerCase();

    const extensionesPermitidas = [
        ".pdf",
        ".doc",
        ".docx",
        ".xls",
        ".xlsx"
    ];

    if (!extensionesPermitidas.includes(extension)) {
        alert("El formato del archivo no está permitido. Seleccione PDF, Word o Excel.");
        return;
    }

    // =========================================
    // GENERAR ID DEL DOCUMENTO
    // =========================================

    const documentosGuardados =
        JSON.parse(localStorage.getItem("documentos")) || [];

    const numeroDocumento = documentosGuardados.length + 1;

    const nuevoDocumento = {
        id: `DOC-${String(numeroDocumento).padStart(3, "0")}`,
        fecha: fecha,
        nombre: nombre,
        tipo: tipo,
        area: area,
        version: version,
        responsable: "Usuario actual",
        estado: estado,
        descripcion: descripcion,
        archivo: nombreArchivo
    };

    // =========================================
    // GUARDAR EN LOCALSTORAGE
    // =========================================

    documentosGuardados.push(nuevoDocumento);

    localStorage.setItem(
        "documentos",
        JSON.stringify(documentosGuardados)
    );

    // =========================================
    // CONFIRMACIÓN
    // =========================================

    alert("Documento guardado correctamente.");

    // Regresar a Gestión Documental
    window.location.href = "documental.html";
});

// =========================================
// LIMPIAR FORMULARIO
// =========================================

formularioDocumento.addEventListener("reset", function () {
    setTimeout(function () {
        archivoDocumento.value = "";
    }, 0);
});