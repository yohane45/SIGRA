const buscarSeguimiento = document.getElementById("buscar-seguimiento");

buscarSeguimiento.addEventListener("click", function () {

    const documento = document
        .getElementById("documento-identidad")
        .value
        .trim();

    if (!documento) {
        alert("Por favor, ingrese el documento de identidad.");
        return;
    }

    const examenesGuardados =
        JSON.parse(localStorage.getItem("examenesMedicos")) || [];

    const examenEncontrado = examenesGuardados.find(function (examen) {
        return examen.documentoIdentidad === documento;
    });

    if (!examenEncontrado) {
        alert("No se encontró un trabajador con ese documento.");
        return;
    }

    document.getElementById("nombres-apellidos").value =
        examenEncontrado.nombresApellidos;

    document.getElementById("restricciones-recomendaciones").value =
        examenEncontrado.restriccionesRecomendaciones || "";
});

const limpiarSeguimiento = document.getElementById("limpiar-seguimiento");

limpiarSeguimiento.addEventListener("click", function () {

    document.getElementById("documento-identidad").value = "";
    document.getElementById("nombres-apellidos").value = "";
    document.getElementById("restricciones-recomendaciones").value = "";

});

const cancelarSeguimiento = document.getElementById("cancelar-seguimiento");

cancelarSeguimiento.addEventListener("click", function () {
    window.location.href = "medica.html";
});