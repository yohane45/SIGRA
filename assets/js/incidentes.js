console.log("incidentes.js cargado");
const botonNuevoIncidente = document.querySelector("#nuevo-incidente");
botonNuevoIncidente.addEventListener("click", function(){
    window.location.href = "nuevo-incidente.html";
});

// Marco Normativo
const botonMarcoNormativo =
    document.querySelector("#marco-normativo");

const modalMarcoNormativo = 
    document.querySelector("#modal-marco-normativo");
    
const cerrarMarcoNormativo =
    document.querySelector("#cerrar-marco-normativo");

botonMarcoNormativo.addEventListener("click", function(){
    modalMarcoNormativo.classList.add("active");
});
cerrarMarcoNormativo.addEventListener("click", function (){
    modalMarcoNormativo.classList.remove("active");
});
modalMarcoNormativo.addEventListener("click", function (event){
    if (event.target === modalMarcoNormativo) {
        modalMarcoNormativo.classList.remove("active");
    }
});