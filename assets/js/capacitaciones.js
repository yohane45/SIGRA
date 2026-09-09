const nuevaCapacitacion = document.getElementById("nueva-capacitacion");

nuevaCapacitacion.addEventListener("click", function () {
    window.location.href = "nueva-capacitacion.html";
});

const marcoNormativo = document.getElementById("marco-normativo");
const modalMarcoNormativo = document.getElementById("modal-marco-normativo");
const cerrarMarcoNormativo = document.getElementById("cerrar-marco-normativo");
const cerrarMarcoNormativoFooter = document.getElementById("cerrar-marco-normativo-footer");

marcoNormativo.addEventListener("click", function(){
    modalMarcoNormativo.classList.add("active");
});

cerrarMarcoNormativo.addEventListener("cilck", function(){
    modalMarcoNormativo.classList.remove("active");
});

cerrarMarcoNormativoFooter.addEventListener("click", function (){
    modalMarcoNormativo.classList.remove("active");
});

modalMarcoNormativo.addEventListener("click", function (event){
    if (event.target === modalMarcoNormativo){
        modalMarcoNormativo.classList.remove("active");
    }
});