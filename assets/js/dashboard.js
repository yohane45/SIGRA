document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("formulario-empresa");

    if (!formulario) {
        console.warn("No se encontró el formulario de información de la empresa.");
        return;
    }

    const campos = {
        nombre: document.getElementById("nombre-empresa"),
        nit: document.getElementById("nit-empresa"),
        actividad: document.getElementById("actividad-empresa"),
        trabajadores: document.getElementById("trabajadores-empresa"),
        fechaActualizacion: document.getElementById("fecha-actualizacion")
    };

    const CLAVE_EMPRESA = "informacionEmpresa";

    // Recuperar información guardada
    const empresaGuardada = JSON.parse(
        localStorage.getItem(CLAVE_EMPRESA)
    );

    if (empresaGuardada) {
        campos.nombre.value = empresaGuardada.nombre || "";
        campos.nit.value = empresaGuardada.nit || "";
        campos.actividad.value = empresaGuardada.actividad || "";
        campos.trabajadores.value = empresaGuardada.trabajadores ?? "";
        campos.fechaActualizacion.value =
            empresaGuardada.fechaActualizacion || "";
    }

    // Guardar información de la empresa
    formulario.addEventListener("submit", (evento) => {

        evento.preventDefault();

        const informacionEmpresa = {
            nombre: campos.nombre.value.trim(),
            nit: campos.nit.value.trim(),
            actividad: campos.actividad.value.trim(),
            trabajadores: Number(campos.trabajadores.value),
            fechaActualizacion: campos.fechaActualizacion.value
        };

        localStorage.setItem(
            CLAVE_EMPRESA,
            JSON.stringify(informacionEmpresa)
        );

        alert("La información de la empresa se guardó correctamente.");

        console.log("Información de la empresa:", informacionEmpresa);

    });

});