const cancelarHistorial = document.getElementById("cancelar-historial");
cancelarHistorial.addEventListener("click", function(){
    window.location.href = "medica.html";
});

const buscarHistorial = document.getElementById("buscar-historial");

buscarHistorial.addEventListener("click", function () {

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

    document.getElementById("cargo-oficio").value =
        examenEncontrado.cargoOficio;

    const historialTrabajador = examenesGuardados.filter(function (examen) {
        return examen.documentoIdentidad === documento;
    });

    const tablaHistorial = document.getElementById("tabla-historial");

    tablaHistorial.innerHTML = "";

    historialTrabajador.forEach(function (examen) {

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${examen.tipoExamen}</td>
            <td>${examen.fechaExamen}</td>
            <td>${examen.centroMedico}</td>
            <td>${examen.conceptoAptitud}</td>
            <td>${examen.restriccionesRecomendaciones || "Sin restricciones o recomendaciones"}</td>
            <td>${examen.fechaProximoControl || "No definido"}</td>
        `;

        tablaHistorial.appendChild(fila);
    });

});

const limpiarBusqueda = document.getElementById("limpiar-busqueda");

limpiarBusqueda.addEventListener("click", function () {

    document.getElementById("documento-identidad").value = "";
    document.getElementById("nombres-apellidos").value = "";
    document.getElementById("cargo-oficio").value = "";

    document.getElementById("tabla-historial").innerHTML = "";

});