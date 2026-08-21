// Catalogo de Peligros GTC 45

const catalogoPeligros = {
    "Biologico":[
        "Virus",
        "Bacterias",
        "Hongos",
        "Ricketsias",
        "Parasitos",
        "Picaduras",
        "Mordeduras",
        "Fluidos o excrementos"
    ],
    "Fisico":[
        "Ruido",
        "Iluminacion",
        "Vibraciones",
        "Temperaturas extremas",
        "Presion atmosferica",
        "Radiaciones ionizantes",
        "Radiaciones no ionizantes"
    ],
    "Quimico":[
        "Polvos organicos e inorganicos",
        "Fibras",
        "Liquidos",
        "Gases y vapores",
        "Humos metalicos y no metalicos",
        "Material particulado"
    ],
    "Psicosocial":[
        "Gestion organizacional",
        "Caracteristicas de la organizacion del trabajo",
        "Caracteristicas del grupo social de trabajo",
        "Condiciones de la tarea",
        "Interfacse persona - tarea",
        "Jornada de trabajo"
    ],
    "Biomecanicos":[
        "Posturas",
        "Esfuerzos",
        "Movimientos repetitivos",
        "Manipulacion manual de cargas"
    ],
    "Condiciones de seguridad":[
        "Mecanico",
        "Electrico",
        "Locativo",
        "Tecnologico",
        "Accidentes de transito",
        "Publicos",
        "Trabajo en alturas",
        "Espacios confinados"
    ],
    "Fenomenos naturales":[
        "Sismos",
        "Terremoto",
        "Vendabal",
        "Inundacion",
        "Derrumbe",
        "Precipitaciones"
    ],
};

const botonCancelar = document.querySelector("#cancelar-evaluacion");

const tipoPeligro = document.querySelector("#tipo-peligro");
const descripcionPeligro = document.querySelector("#descripcion-peligro");

function actualizarDescripcionPeligro(){
    const clasificacionSeleccionada = tipoPeligro.value;
    descripcionPeligro.innerHTML = "";
    if (clasificacionSeleccionada === ""){
        const opcionInicial = document.createElement("option");
        opcionInicial.value = "";
        opcionInicial.textContent = "Seleccione primero una clasificacion";
        descripcionPeligro.appendChild(opcionInicial);
        return;
    }
    const peligros = catalogoPeligros[clasificacionSeleccionada];
    peligros.forEach(function(peligro){
        const opcion = document.createElement("option");
        opcion.value = peligro;
        opcion.textContent = peligro;
        descripcionPeligro.appendChild(opcion);
    });

};
tipoPeligro.addEventListener("change", actualizarDescripcionPeligro);

const formularioRiesgo = document.querySelector("#formulario-riesgo");
const nivelDeficiencia = document.querySelector("#deficiency-level");
const nivelExposicion = document.querySelector("#exposure-level");
const nivelProbabilidad = document.querySelector("#probability-level");
const nivelConsecuencia = document.querySelector("#consequence-level");
const nivelRiesgo = document.querySelector("#risk-result");
const interpretacionRiesgo = document.querySelector("#risk-interpretation")

// Botón cancelar
botonCancelar.addEventListener("click", function(){
    window.location.href = "riesgos.html";
})

function calcularNivelProbabilidad(){
    const nd = Number(nivelDeficiencia.value);
    const ne = Number(nivelExposicion.value);

    // Si todavia no se han seleccionado los dos valores
    if (!nd || !ne){
        nivelProbabilidad.value = "";
        return;
    }
    // Formula GTC 45
    const np = nd * ne;
    let clasificacion = "";
    if (np >=24){
        clasificacion = "Muy Alto";
    }
    else if (np >= 10){
        clasificacion = "Alto";
    }
    else if (np >=6){
        clasificacion = "Medio";
    }
    else {
        clasificacion = "Bajo";
    }
    nivelProbabilidad.value = `${np} - ${clasificacion}`;

    console.log("Nivel de Deficiencia", nd);
    console.log("Nivel de Exposicion", ne);
    console.log("Nivel de Probabilidad", np);
    console.log("Clasificacion", clasificacion);
}

function calcularNivelRiesgo() {
    
    const nd = Number(nivelDeficiencia.value);
    const ne = Number(nivelExposicion.value);
    const nc = Number(nivelConsecuencia.value);

    if (!nd || !ne || !nc) {
        nivelRiesgo.value = "";
        return;
    }

    // Nivel de Probabilidad
    const np = nd * ne;

    // Nivel de Riesgo
    const nr = np * nc;

    let nivel = "";
    let interpretacion = "";

    if (nr >= 600){
        nivel = "I";
        interpretacion = "No aceptable";
}
else if (nr >= 150){
    nivel = "II";
    interpretacion = "No aceptable o aceptable con control especifico";
}
else if (nr >= 40){
    nivel = "III";
    interpretacion = "Mejorable";
}
else {
    nivel = "IV";
    interpretacion = "Aceptable";
}
nivelRiesgo.value = `${nr} - Nivel ${nivel}`;
interpretacionRiesgo.value = interpretacion;

console.log("ND:", nd);
console.log("NE:", ne);
console.log("NP:", np);
console.log("NC:", nc);
console.log("NR:", nr);
console.log("NIvel de Riesgo:", nivel);
}

// Detectar cambios en ND
nivelDeficiencia.addEventListener("change", calcularNivelProbabilidad);

// Detectar cambios en NE
nivelExposicion.addEventListener("change", calcularNivelProbabilidad);

nivelDeficiencia.addEventListener("change", calcularNivelRiesgo);
nivelExposicion.addEventListener("change", calcularNivelRiesgo);
nivelConsecuencia.addEventListener("change", calcularNivelRiesgo);

// Validar formulario
formularioRiesgo.addEventListener("submit", function(event){
    event.preventDefault();

    const codigo = document.querySelector("#risk-code").value.trim();
    const nombre = document.querySelector("#risk-name").value.trim();
    const area = document.querySelector("#area").value.trim();
    const reportadoPor = document.querySelector("#responsible").value.trim();
    const descripcion = document.querySelector("#description").value.trim();
    const medidasControl = document.querySelector("#control-measures").value.trim();

    const nd = nivelDeficiencia.value;
    const ne = nivelExposicion.value;
    const nc = nivelConsecuencia.value;

    if (
        codigo === "" ||
        nombre === "" ||
        area === "" ||
        reportadoPor === "" ||
        descripcion === "" ||
        medidasControl === "" ||
        nd === "" ||
        ne === "" ||
        nc === ""
    ){
        alert("Por favor, complete todos los campos antes de guardar la evaluacion.");
        return;
    }
    // alert("Todos los campos fueron diligenciados correctamente.");
    const evaluacion = {
        codigo: codigo,
        nombre: nombre,
        tipoPeligro: tipoPeligro.value,
        descripcionPeligro: descripcionPeligro.value,
        area: area,
        reportadoPor: reportadoPor,
        fecha: new Date().toISOString(),
        descripcion: descripcion,
        medidasControl: medidasControl,

        nd: Number(nd),
        ne: Number(ne),
        nc: Number(nc),

        np: Number(nd) * Number(ne),
        nr: Number(nd) * Number(ne) * Number(nc),

        nivelRiesgo: nivelRiesgo.value,
        interpretacion: interpretacionRiesgo.value,

        estado: "Activo"
    };
    const evaluacionesGuardadas =
        JSON.parse(localStorage.getItem("evaluacionesRiesgos")) || [];

    evaluacionesGuardadas.push(evaluacion);

    localStorage.setItem(
        "evaluacionesRiesgos",
        JSON.stringify(evaluacionesGuardadas)
    );

    alert("La evaluacion fue guardada correctamente.");
    window.location.href = "riesgos.html";

});