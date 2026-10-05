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

    const seguimientosMedicos =
    JSON.parse(localStorage.getItem("seguimientosMedicos")) || [];

const seguimientoEncontrado = seguimientosMedicos.find(
    function (seguimiento) {
        return seguimiento.documentoIdentidad === documento;
    }
);

programasVigilancia.forEach(function (programa) {
    programa.checked = false;
});

if (seguimientoEncontrado) {

    seguimientoEncontrado.programasVigilancia.forEach(
        function (programaGuardado) {

            programasVigilancia.forEach(function (programa) {

                if (programa.value === programaGuardado) {
                    programa.checked = true;
                }

            });

        }
    );
}    
});

const limpiarSeguimiento = document.getElementById("limpiar-seguimiento");
limpiarSeguimiento.addEventListener("click", function () {
    document.getElementById("documento-identidad").value = "";
    document.getElementById("nombres-apellidos").value = "";
    document.getElementById("restricciones-recomendaciones").value = "";
    programasVigilancia.forEach(function (programa) {
        programa.checked = false;
    });

});

const cancelarSeguimiento = document.getElementById("cancelar-seguimiento");

cancelarSeguimiento.addEventListener("click", function () {
    window.location.href = "medica.html";
});

const programasVigilancia = document.querySelectorAll('input[name="programas-vigilancia"]');

programasVigilancia.forEach(function (programa) {
    programa.addEventListener("change", function () {
        const programasSelecionados =
            Array.from(programasVigilancia)
                .filter(function (programa) {
                    return programa.checked;
                })
                .map(function (programa) {
                    return programa.value;
                });
        console.log("PVE seleccionados:", programasSelecionados);
    });
});

const guardarSeguimiento =
    document.getElementById("guardar-seguimiento");

guardarSeguimiento.addEventListener("click", function () {

    const documento = document
        .getElementById("documento-identidad")
        .value
        .trim();

    if (!documento) {
        alert("Primero debe buscar un trabajador.");
        return;
    }

    const nombresApellidos =
        document.getElementById("nombres-apellidos").value.trim();

    if (!nombresApellidos) {
        alert("Primero debe buscar un trabajador.");
        return;
    }

    const programasSeleccionados =
        Array.from(programasVigilancia)
            .filter(function (programa) {
                return programa.checked;
            })
            .map(function (programa) {
                return programa.value;
            });

    if (programasSeleccionados.length === 0) {
        alert("Seleccione al menos un programa de vigilancia epidemiológica.");
        return;
    }

    const seguimientosMedicos =
        JSON.parse(localStorage.getItem("seguimientosMedicos")) || [];

    const seguimientoExistente = seguimientosMedicos.findIndex(
        function (seguimiento) {
            return seguimiento.documentoIdentidad === documento;
        }
    );

    const nuevoSeguimiento = {
        documentoIdentidad: documento,
        nombresApellidos: nombresApellidos,
        programasVigilancia: programasSeleccionados
    };

    if (seguimientoExistente !== -1) {
        seguimientosMedicos[seguimientoExistente] = nuevoSeguimiento;
    } else {
        seguimientosMedicos.push(nuevoSeguimiento);
    }

    localStorage.setItem(
        "seguimientosMedicos",
        JSON.stringify(seguimientosMedicos)
    );

    alert("Seguimiento médico guardado correctamente.");
});
