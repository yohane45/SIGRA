console.log("nuevo-incidentes.js cargado");

// ===============================
// BOTÓN CANCELAR
// ===============================
const botonCancelar = document.querySelector("#cancelar-incidente");

if (botonCancelar) {
    botonCancelar.addEventListener("click", function () {
        window.location.href = "incidentes.html";
    });
}

// ===============================
// BOTÓN GUARDAR INCIDENTE
// ===============================
const botonGuardar = document.querySelector(
    '.button-primary[type="submit"]'
);

if (botonGuardar) {
    botonGuardar.addEventListener("click", function (event) {

        event.preventDefault();

// -------------------------------
// INFORMACIÓN GENERAL
// -------------------------------
    const tipoIncidente =
        document.querySelector("#tipo-incidente").value;

    const area =
        document.querySelector("#area-incidente").value;

        const fecha =
            document.querySelector("#fecha-incidente").value;

        const nombreAccidentado =
            document.querySelector("#nombre-accidentado").value;

        const lugar =
            document.querySelector("#lugar-incidente").value;

        const descripcion =
            document.querySelector("#descripcion-incidente").value;


// -------------------------------
// INVESTIGACIÓN DEL INCIDENTE
// -------------------------------
        const efecto =
            document.querySelector("#efecto-incidente").value;

        const personas =
            document.querySelector("#causas-personas").value;

        const metodos =
            document.querySelector("#acciones-correctivas").value;

        const equipos =
            document.querySelector("#causas-equipos").value;

        const materiales =
            document.querySelector("#causas-materiales").value;

        const ambientales =
            document.querySelector("#causas-ambientales").value;

        const gestion =
            document.querySelector("#causas-gestion").value;

        const causaRaiz =
            document.querySelector("#causa-raiz").value;

        // El segundo campo acciones-correctivas
        // tiene actualmente el mismo ID en el HTML.
        const camposAcciones =
            document.querySelectorAll("#acciones-correctivas");

        const accionesCorrectivas =
            camposAcciones.length > 1
                ? camposAcciones[1].value
                : "";

// -------------------------------
// VALIDACIÓN BÁSICA
// -------------------------------
        if (
            !tipoIncidente ||
            !area ||
            !fecha ||
            !nombreAccidentado
        ) {
            alert(
                "Por favor complete los campos obligatorios de la información general."
            );
            return;
        }


// -------------------------------
// OBTENER INCIDENTES EXISTENTES
// -------------------------------
        let incidentes =
            JSON.parse(localStorage.getItem("incidentes")) || [];


// -------------------------------
// GENERAR ID
// -------------------------------
        const numeroIncidente = incidentes.length + 1;

        const idIncidente =
            `INC-${String(numeroIncidente).padStart(3, "0")}`;


// -------------------------------
// CREAR REGISTRO
// -------------------------------
        const nuevoIncidente = {

            id: idIncidente,

            informacion: {
                tipoIncidente: tipoIncidente,
                area: area,
                fecha: fecha,
                nombreAccidentado: nombreAccidentado,
                lugar: lugar,
                descripcion: descripcion
            },

            investigacion: {
                efecto: efecto,
                personas: personas,
                metodos: metodos,
                equipos: equipos,
                materiales: materiales,
                ambientales: ambientales,
                gestion: gestion,
                causaRaiz: causaRaiz,
                accionesCorrectivas: accionesCorrectivas
            },

            fechaRegistro: new Date().toISOString()
        };


// -------------------------------
// GUARDAR EN LOCALSTORAGE
// -------------------------------
        incidentes.push(nuevoIncidente);

        localStorage.setItem(
            "incidentes",
            JSON.stringify(incidentes)
        );


// -------------------------------
// CONFIRMACIÓN
// -------------------------------
        alert(
            `Incidente ${idIncidente} guardado correctamente.`
        );

        console.log(
            "Incidente guardado:",
            nuevoIncidente
        );

        console.log(
            "Todos los incidentes:",
            incidentes
        );


// -------------------------------
// REGRESAR A INCIDENTES
// -------------------------------
        window.location.href = "incidentes.html";
    });
}