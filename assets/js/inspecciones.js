const botonMarcoNormativo = document.querySelector("#marco-normativo");
const modalMarcoNormativo = document.querySelector("#modal-marco-normativo");
const cerrarMarcoNormativo = document.querySelector("#cerrar-marco-normativo");
const botonNuevaInspeccion = document.querySelector("#nueva-inspeccion");

botonNuevaInspeccion.addEventListener("click", function(){
    window.location.href = "nueva-inspeccion.html";
});

botonMarcoNormativo.addEventListener("click", function(){
    modalMarcoNormativo.classList.add("active");
});
cerrarMarcoNormativo.addEventListener("click",function(){
    modalMarcoNormativo.classList.remove("active");
});
modalMarcoNormativo.addEventListener("click", function(evento){
    if (evento.target === modalMarcoNormativo){
        modalMarcoNormativo.classList.remove("active");
    }
});
