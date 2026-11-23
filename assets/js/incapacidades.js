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
    const trabajadores = JSON.parse(localStorage.getItem("trabajadores")) || [];
    const trabajador = trabajadores.find(persona => String(persona.documentoIdentidad).trim() === documento);

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
    const vinculaciones = JSON.parse(localStorage.getItem("vinculaciones")) || [];

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

// Controlar el registro que se encuentra en edición
let incapacidadEnEdicion = null;

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

    // Obtener registros existentes
const incapacidades = JSON.parse(localStorage.getItem("incapacidades")) || [];

// Buscar el registro que se está editando
const indiceEdicion = incapacidades.findIndex(registro => registro.idIncapacidad === incapacidadEnEdicion);

const incapacidadAnterior = indiceEdicion !== -1
    ? incapacidades[indiceEdicion]
    : null;

// Conservar el soporte documental anterior
let soporteDocumental = incapacidadAnterior
    ? incapacidadAnterior.soporteDocumental
    : null;

// Reemplazar soporte solamente si se selecciona uno nuevo
if (archivo) {
    soporteDocumental = {
        nombre: archivo.name,
        tipo: archivo.type,
        contenido: await convertirArchivoBase64(archivo)
    };
}

// Construir registro actualizado
const nuevaIncapacidad = {
    idIncapacidad: incapacidadAnterior
        ? incapacidadAnterior.idIncapacidad
        : crypto.randomUUID(),

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

    estado: incapacidadAnterior
        ? incapacidadAnterior.estado
        : "Registrada",

    fechaRegistro: incapacidadAnterior
        ? incapacidadAnterior.fechaRegistro
        : new Date().toISOString()
};

// Actualizar o agregar registro
if (incapacidadAnterior) {
    incapacidades[indiceEdicion] = nuevaIncapacidad;
} else {
    incapacidades.push(nuevaIncapacidad);
}

// Guardar en localStorage
localStorage.setItem(
    "incapacidades",
    JSON.stringify(incapacidades)
);

// Finalizar modo edición
incapacidadEnEdicion = null;

// Actualizar tabla
mostrarIncapacidades();

// Confirmar operación
alert(
    incapacidadAnterior
        ? "La incapacidad se ha actualizado correctamente."
        : "La incapacidad se ha guardado correctamente."
);

    }catch (error) {
        console.error("Error al guardar la incapacidad", error);
    }
});

// ==========================================
// MOSTRAR INCAPACIDADES REGISTRADAS
// ==========================================

const cuerpoTablaIncapacidades = document.getElementById(
    "cuerpo-tabla-incapacidades"
);

function mostrarIncapacidades() {

    // Consultar incapacidades almacenadas
    const incapacidades = JSON.parse(localStorage.getItem("incapacidades")) || [];

    // Limpiar contenido anterior de la tabla
    cuerpoTablaIncapacidades.innerHTML = "";

    // Verificar si existen registros
    if (incapacidades.length === 0) {

        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.colSpan = 9;
        celda.textContent = "No hay incapacidades registradas.";

        fila.appendChild(celda);
        cuerpoTablaIncapacidades.appendChild(fila);

        return;
    }

    // Recorrer los registros
    incapacidades.forEach(incapacidad => {

        const fila = document.createElement("tr");

        const codigo = incapacidad.idIncapacidad
            ? incapacidad.idIncapacidad.substring(0, 8).toUpperCase()
            : "Sin código";

        const datos = [
            codigo,
            incapacidad.nombreTrabajador,
            incapacidad.documentoIdentidad,
            incapacidad.origenIncapacidad,
            incapacidad.fechaInicio,
            incapacidad.fechaFin,
            incapacidad.diasIncapacidad,
            incapacidad.estado,
        ];
    // Crear celdas con la información
        datos.forEach(dato => {
            const celda = document.createElement("td");
            celda.textContent = dato ?? "";
            fila.appendChild(celda);
        });

    // Crear celda de acciones
    const celdaAcciones = document.createElement("td");

    // Botón Consultar
    const botonConsultar = document.createElement("button");
    botonConsultar.type = "button";
    botonConsultar.textContent = "Consultar";
    botonConsultar.className = "button button-secundary";
    botonConsultar.dataset.accion = "consultar";
    botonConsultar.dataset.id = incapacidad.idIncapacidad;

    // Boton Editar
    const botonEditar = document.createElement("button");
    botonEditar.type ="button";
    botonEditar.textContent = "Editar";
    botonEditar.className = "button button-primary";
    botonEditar.dataset.accion = "editar";
    botonEditar.dataset.id = incapacidad.idIncapacidad;

    // Contenedor de botones
    const contenedorAcciones = document.createElement("div");
    contenedorAcciones.className = "acciones-incapacidad";

    // Agregar botones al contenedor
    contenedorAcciones.appendChild(botonConsultar);
    contenedorAcciones.appendChild(botonEditar);

    // Agregar contenedor a la celda
    celdaAcciones.appendChild(contenedorAcciones);

    // Agregar celda a la fila
    fila.appendChild(celdaAcciones);
    cuerpoTablaIncapacidades.appendChild(fila);
    });
}

// Mostrar registros al cargar la página
mostrarIncapacidades();

// ==========================================
// CONSULTAR DETALLE DE INCAPACIDAD
// ==========================================

const modalConsulta = document.getElementById("modal-consulta-incapacidad");
const detalleIncapacidad = document.getElementById("detalle-incapacidad");
const cerrarModal = document.getElementById("cerrar-modal-incapacidad");

// Evento para consultar los registros
cuerpoTablaIncapacidades.addEventListener("click", function (evento) {

const boton = evento.target.closest('[data-accion="consultar"]');
    if (!boton) {
        return;
    }
    const id = boton.dataset.id;
    const incapacidades = JSON.parse(localStorage.getItem("incapacidades")) || [];
    const incapacidad = incapacidades.find(registro => registro.idIncapacidad === id);

    if (!incapacidad) {
        alert("No se encontró la incapacidad seleccionada.");
        return;
    }

    // Preparar información del registro
    const campos = [
        ["Trabajador", incapacidad.nombreTrabajador],
        ["Documento", incapacidad.documentoIdentidad],
        ["Cargo", incapacidad.cargo],
        ["Área", incapacidad.area],
        ["Tipo de incapacidad", incapacidad.tipoIncapacidad],
        ["Origen", incapacidad.origenIncapacidad],
        ["Fecha de inicio", incapacidad.fechaInicio],
        ["Fecha de finalización", incapacidad.fechaFin],
        ["Días de incapacidad", incapacidad.diasIncapacidad],
        ["Entidad que expide", incapacidad.entidadExpide],
        ["Número del certificado", incapacidad.numeroCertificado],
        ["Estado", incapacidad.estado],
        ["Observaciones", incapacidad.observaciones]
    ];

    // Limpiar contenido anterior
    detalleIncapacidad.innerHTML = "";

    // Crear los campos de consulta
    campos.forEach(([etiqueta, valor]) => {
    const grupo = document.createElement("div"); grupo.className = "detalle-incapacidad-item";
    const titulo = document.createElement("strong"); titulo.textContent = etiqueta;
    const contenido = document.createElement("span"); contenido.textContent = valor || "No registrado";

        grupo.appendChild(titulo);
        grupo.appendChild(contenido);
        detalleIncapacidad.appendChild(grupo);
    });

    // Mostrar soporte documental
    const grupoSoporte = document.createElement("div");
    grupoSoporte.className = "detalle-incapacidad-item";

    const tituloSoporte = document.createElement("strong");
    tituloSoporte.textContent = "Soporte documental";

    grupoSoporte.appendChild(tituloSoporte);

    if (
        incapacidad.soporteDocumental &&
        incapacidad.soporteDocumental.contenido
    ) {

    const enlace = document.createElement("a");
        enlace.href = incapacidad.soporteDocumental.contenido;
        enlace.target = "_blank";
        enlace.rel = "noopener noreferrer";
        enlace.textContent = incapacidad.soporteDocumental.nombre;
        grupoSoporte.appendChild(enlace);
    } else {

    const mensaje = document.createElement("span"); mensaje.textContent = "Sin soporte documental.";
        grupoSoporte.appendChild(mensaje);
    }
    detalleIncapacidad.appendChild(grupoSoporte);

    // Abrir ventana modal
    modalConsulta.showModal();
});

// Cerrar ventana modal
cerrarModal.addEventListener("click", function () {
    modalConsulta.close();
});

// ==========================================
// CARGAR INCAPACIDAD PARA EDICIÓN
// ==========================================

cuerpoTablaIncapacidades.addEventListener("click", function (evento) {

    const boton = evento.target.closest('[data-accion="editar"]');
    if (!boton) {
        return;
    }
    const id = boton.dataset.id;
    const incapacidades = JSON.parse(localStorage.getItem("incapacidades")) || [];
    const incapacidad = incapacidades.find(registro => registro.idIncapacidad === id);
    if (!incapacidad) {
        alert("No se encontró la incapacidad seleccionada.");
        return;
    }

    // Identificar el registro que se está editando
    incapacidadEnEdicion = incapacidad.idIncapacidad;

    // Cargar información del trabajador
    documentoIdentidad.value = incapacidad.documentoIdentidad;
    nombreApellidos.value = incapacidad.nombreTrabajador;
    cargoOficio.value = incapacidad.cargo;
    areaSeccionSede.value = incapacidad.area;
    idTrabajador.value = incapacidad.idTrabajador;

    // Cargar información de la incapacidad
    tipoIncapacidad.value = incapacidad.tipoIncapacidad;
    origenIncapacidad.value = incapacidad.origenIncapacidad;
    fechaInicio.value = incapacidad.fechaInicio;
    fechaFin.value = incapacidad.fechaFin;
    diasIncapacidad.value = incapacidad.diasIncapacidad;
    entidadExpide.value = incapacidad.entidadExpide;
    numeroCertificado.value = incapacidad.numeroCertificado;
    observacionesAdministrativas.value = incapacidad.observaciones;

    // Actualizar cálculo de días
    calcularDiasIncapacidad();

    // Desplazarse hasta el formulario
    formularioIncapacidades.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});