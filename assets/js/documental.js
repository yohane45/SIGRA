// =========================================
// GESTIÓN DOCUMENTAL
// =========================================

const nuevoDocumento = document.getElementById("nuevo-documento");

nuevoDocumento.addEventListener("click", function () {
    window.location.href = "nuevo-documento.html";
});

// =========================================
// MARCO NORMATIVO
// =========================================

const botonMarcoNormativo = document.getElementById("marco-normativo");
const modalMarcoNormativo = document.getElementById("modal-marco-normativo");
const cerrarMarcoNormativo = document.getElementById("cerrar-marco-normativo");
const cerrarMarcoNormativoFooter = document.getElementById("cerrar-marco-normativo-footer");

botonMarcoNormativo.addEventListener("click", function(){
    modalMarcoNormativo.classList.add("active");
});

cerrarMarcoNormativo.addEventListener("click", function(){
    modalMarcoNormativo.classList.remove("active");
});

cerrarMarcoNormativoFooter.addEventListener("click", function(){
    modalMarcoNormativo.classList.remove("active");
});

modalMarcoNormativo.addEventListener("click", function (evento){
    if (evento.target === modalMarcoNormativo){
        modalMarcoNormativo.classList.remove("active");
    }
});