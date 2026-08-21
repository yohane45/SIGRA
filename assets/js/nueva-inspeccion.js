const botonCancelar = document.querySelector("#cancelar-inspeccion");
    botonCancelar.addEventListener("click", function(){
    window.location.href = "inspecciones.html";
});
// correcciones pendientes formulario//
const formulario = document.querySelector("#form-nueva-inspeccion");
formulario.addEventListener("submit", function(evento){
    evento.preventDefault();
    const tipo = document.querySelector("#tipo-inspeccion").value;
    const area = document.querySelector("#area-inspeccion").value;
    const fecha = document.querySelector("#fecha-inspeccion").value;
    const responsable = document.querySelector("#responsable-inspeccion").value;
    const objetivo = document.querySelector("#objetivo-inspeccion").value;

    if (
        tipo === "" ||
        area === "" ||
        fecha === "" ||
        responsable.trim() === "" ||
        objetivo.trim() === ""

    ) {
        alert("Por favor, complete los campos obligatorios.");
        return;
    }
    alert("La inspeccion fue validada correctamente.");
});