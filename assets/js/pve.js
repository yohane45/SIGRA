const programaPve = document.getElementById("programa-pve");
const tablaTrabajadoresPve =
    document.getElementById("tabla-trabajadores-pve");

programaPve.addEventListener("change", function () {

    const programaSeleccionado = programaPve.value;

    tablaTrabajadoresPve.innerHTML = "";

    if (!programaSeleccionado) {
        return;
    }

    const seguimientosMedicos =
        JSON.parse(localStorage.getItem("seguimientosMedicos")) || [];

    const trabajadoresFiltrados = seguimientosMedicos.filter(
        function (seguimiento) {
            return seguimiento.programasVigilancia.includes(
                programaSeleccionado
            );
        }
    );

if (trabajadoresFiltrados.length === 0) {

    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td colspan="3">
            No hay trabajadores vinculados a este Programa de Vigilancia Epidemiológica.
        </td>
    `;

    tablaTrabajadoresPve.appendChild(fila);

} else {

    trabajadoresFiltrados.forEach(function (trabajador) {

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${trabajador.documentoIdentidad}</td>
            <td>${trabajador.nombresApellidos}</td>
            <td>${programaSeleccionado}</td>
        `;

        tablaTrabajadoresPve.appendChild(fila);
    });
}

});

const volverPve = document.getElementById("volver-pve");

volverPve.addEventListener("click", function () {
    window.location.href = "medica.html";
});

