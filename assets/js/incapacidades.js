// NAVEGACIÓN: REGRESAR A GESTIÓN MÉDICA

document.getElementById("volver-incapacidad").addEventListener("click", function () {
    window.location.href = "medica.html";
});

// CONSULTAR TRABAJADOR POR DOCUMENTO

const documentoIdentidad = document.getElementById("documento-identidad");
const nombreApellidos = document.getElementById("nombres-apellidos");
const cargoOficio = document.getElementById("cargo-oficio");
const areaSeccionSede = document.getElementById("area-seccion-sede");
const idTrabajador = document.getElementById("id-trabajador");
const estadoTrabajador = document.getElementById("estado-trabajador");

// BUSCAR TRABAJADOR

function buscarTrabajador() {
    const documento = documentoIdentidad.value.trim();

    // Limpiar datos anteriores
    nombreApellidos.value = "";
    cargoOficio.value = "";
    areaSeccionSede.value = "";
    idTrabajador.value = "";
    estadoTrabajador.textContent = "";

    if (!documento) {
        return;
    }

    // Consultar trabajadores registrados
    const trabajadores = JSON.parse(
        localStorage.getItem("trabajadores")
    ) || [];

    const trabajador = trabajadores.find(persona =>
        String(persona.documentoIdentidad).trim() === documento
    );

    // Validar existencia del trabajador
    if (!trabajador) {
        estadoTrabajador.textContent = "Trabajador no registrado.";
        return;
    }

    // Autocompletar datos personales
    nombreApellidos.value =
        `${trabajador.nombres} ${trabajador.apellidos}`;

    idTrabajador.value = trabajador.idTrabajador;

    // Consultar vinculaciones
    const vinculaciones = JSON.parse(
        localStorage.getItem("vinculaciones")
    ) || [];

    // Buscar la vinculación activa más reciente
    const vinculacion = vinculaciones
        .filter(registro =>
            registro.idTrabajador === trabajador.idTrabajador &&
            registro.estado === "Activo"
        )
        .sort((a, b) =>
            new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
        )[0];

    // Validar vinculación activa
    if (!vinculacion) {
        estadoTrabajador.textContent =
            "Trabajador encontrado, pero no tiene una vinculación activa.";
        return;
    }

    // Autocompletar información laboral
    cargoOficio.value = vinculacion.cargo || "";
    areaSeccionSede.value = vinculacion.area || "";
    
}

// Evento de busquedas
documentoIdentidad.addEventListener("keydown", function (evento){
    if (evento.key === "Enter") {
        evento.preventDefault();
        buscarTrabajador();
    }
})
documentoIdentidad.addEventListener("blur", buscarTrabajador);

// CALCULO AUTIMÁTICO DE DIAS DE INCAPACIDAD
const fechaInicio = document.getElementById("fecha-inicio");
const fechaFin = document.getElementById("fecha-fin");
const diasIncapacidad = document.getElementById("dias-incapacidad");

    // Calcular dias al cambiar la fecha
    function calcularDiasIncapacidad(){
        const inicio = fechaInicio.value;
        const fin = fechaFin.value;

        // LImpiar resultado anterior
        diasIncapacidad.value = "";
        if (!inicio || !fin) {
            return;
        }

        // Covertir fecha en milisegundos
        const fechaInicial = new Date(inicio + "T00:00:00");
        const fechaFinal = new Date(fin + "T00:00:00");

        // Validar que la fecha no sea anterior
        if (fechaFinal < fechaInicial) {
            fechaFin.setCustomValidity(
                "La fecha de finalización no puede ser anterior a la fecha de inicio."
            );
            fechaFin.reportValidity();
            return;
        }
        fechaFin.setCustomValidity("");

        // Calcular la diferencia incluyendo ambos dias
        const diferencia = fechaFinal - fechaInicial;
        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24)) + 1;
        diasIncapacidad.value = dias;
    }

    // Eventos de cambio de fecha
    fechaInicio.addEventListener("change", calcularDiasIncapacidad);
    fechaFin.addEventListener("change", calcularDiasIncapacidad);

//  GUARDAR INCAPACIDADES 

const formularioIncapacidades = document.getElementById("form-incapacidades");
const tipoIncapacidad = document.getElementById("tipo-incapacidad");
const origenIncapacidad = document.getElementById("origen-incapacidad");
const entidadExpide = document.getElementById("entidad-expide");
const numeroCertificado = document.getElementById("numero-certificado");
const archivoIncapacidad = document.getElementById("archivo-incapacidad");
const observacionesAdministrativas = document.getElementById("observaciones-administrativas");

// Convertir archivo a Base64
function convertirArchivoBase64(archivo) {

    return new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.onload = () => resolve(lector.result);
        lector.onerror = () => reject(new Error("No se pudo leer el archivo."));
        lector.readAsDataURL(archivo);
    });
}

// Evento para guardar la incapacidad
formularioIncapacidades.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    // Validar trabajador
    if (!idTrabajador.value) {
        estadoTrabajador.textContent =
            "Debe consultar un trabajador con vinculación activa.";
        documentoIdentidad.focus();
        return;
    }

    // Validar campos obligatorios
    if (!formularioIncapacidades.checkValidity()) {
        formularioIncapacidades.reportValidity();
        return;
    }

    // Validar días
    if (!diasIncapacidad.value || Number(diasIncapacidad.value) <= 0) {
        alert("Verifique las fechas de la incapacidad.");
        return;
    }

    // Validar soporte documental
    const archivo = archivoIncapacidad.files[0];
    if (archivo) {
        const formatosPermitidos = [
            "pdf",
            "jpg",
            "jpeg",
            "png"
        ];

        const extension = archivo.name.split(".").pop().toLowerCase();
        if (!formatosPermitidos.includes(extension)) {
            alert("El archivo debe estar en formato PDF, JPG, JPEG o PNG.");
            return;
        }

        // Límite de tamaño: 1 MB
        if (archivo.size > 1024 * 1024) {
            alert("El archivo no puede superar 1 MB.");
            return;
        }
    }
    try {

        // Convertir soporte documental
        let soporteDocumental = null;
        if (archivo) {
            soporteDocumental = {
                nombre: archivo.name,
                tipo: archivo.type,
                contenido: await convertirArchivoBase64(archivo)
            };
        }

        // Obtener registros existentes
        const incapacidades = JSON.parse(
            localStorage.getItem("incapacidades")
        ) || [];

        // Crear nuevo registro
        const nuevaIncapacidad = {
            idIncapacidad: crypto.randomUUID(),
            idTrabajador: idTrabajador.value,
            documentoIdentidad: documentoIdentidad.value.trim(),
            nombreTrabajador: nombreApellidos.value,
            cargo: cargoOficio.value,
            area: areaSeccionSede.value,
            tipoIncapacidad: tipoIncapacidad.value,
            origenIncapacidad: origenIncapacidad.value,
            fechaInicio: fechaInicio.value,
            fechaFin: fechaFin.value,
            diasIncapacidad: Number(diasIncapacidad.value),
            entidadExpide: entidadExpide.value.trim(),
            numeroCertificado: numeroCertificado.value.trim(),
            soporteDocumental: soporteDocumental,
            observaciones: observacionesAdministrativas.value.trim(),
            estado: "Registrada",
            fechaRegistro: new Date().toISOString()
        };

        // Agregar registro
        incapacidades.push(nuevaIncapacidad);

        // Guardar en localStorage
        localStorage.setItem(
            "incapacidades",
            JSON.stringify(incapacidades)
        );

        alert("La incapacidad se ha guardado correctamente.");
    } catch (error) {
        console.error("Error al guardar la incapacidad:", error);
        alert(
            "No fue posible guardar la incapacidad. Verifique el almacenamiento disponible."
        );
    }
});