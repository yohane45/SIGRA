const botonCancelar = document.querySelector("#cancelar-inspeccion");
botonCancelar.addEventListener("click", function(){
    window.location.href = "inspecciones.html";
});
// formulario//
const formularioInspeccion = document.querySelector("#form-nueva-inspeccion");

formularioInspeccion.addEventListener("submit", function(event){

    event.preventDefault();

    const tipo = document.querySelector("#tipo-inspeccion").value.trim();
    const area = document.querySelector("#area-inspeccion").value.trim();
    const fecha = document.querySelector("#fecha-inspeccion").value.trim();
    const responsable = document.querySelector("#responsable-inspeccion").value.trim();
    const objetivo = document.querySelector("#objetivo-inspeccion").value.trim();

    if (
        tipo === "" ||
        area === "" ||
        fecha === "" ||
        responsable === "" ||
        objetivo === ""

    ) {
        alert("Por favor, complete los campos obligatorios.");
        return;
    }
    alert("La inspeccion fue validada correctamente.");
});