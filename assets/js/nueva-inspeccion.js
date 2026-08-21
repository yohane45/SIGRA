console.log("nueva-inspeccion.js cargado");

const botonCancelar = document.querySelector("#cancelar-inpeccion");
botonCancelar.addEventListener("click", function(){
    window.location.href = "inspecciones.html";
});