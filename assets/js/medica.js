const examenesMedicos = document.getElementById("examenes-medicos");

examenesMedicos.addEventListener("click", function(){
    window.location.href = "nuevo-examen.html";
});

const historialMedico = document.getElementById("historial-medico");

historialMedico.addEventListener("click", function () {
    window.location.href = "historial-medico.html";
});

document.addEventListener("DOMContentLoaded", function () {

    const tablaExamenes = document.getElementById("tabla-examenes");

    const examenesGuardados =
        JSON.parse(localStorage.getItem("examenesMedicos")) || [];

    console.log("Exámenes guardados:", examenesGuardados);
    console.log("Cantidad de exámenes:", examenesGuardados.length);

    examenesGuardados.forEach(function (examen) {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${examen.id}</td>
            <td>${examen.nombresApellidos}</td>
            <td>${examen.tipoExamen}</td>
            <td>${examen.fechaExamen}</td>
            <td>${examen.conceptoAptitud}</td>
            <td>${examen.estadoSeguimiento}</td>
        `;

        tablaExamenes.appendChild(fila);
    });

});