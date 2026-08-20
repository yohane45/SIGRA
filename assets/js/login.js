const campoUsuario = document.querySelector("#usuario");
const campoRol = document.querySelector("#rol");
const campoPassword = document.querySelector("#password");
const formularioLogin = document.querySelector("form");

const usuarios ={
    "admin01":{
        password: "123456",
        rol: "Administrador"
    },
    "gerencia01":{
        password:"123456",
        rol: "Gerencia"
    },
    "coordinador01":{
        password: "123456",
        rol: "Equipo SST - Coordinador"
    },
    "analista01":{
        password: "123456",
        rol: "Equipo SST - Analista"
    },
    "auxiliar01":{
        password: "123456",
        rol: "Equipo SST - Auxiliar"
    },
    "rrhh01":{
        password: "123456",
        rol: "Recursos Humanos"
    },
    "trabajador01":{
        password: "123456",
        rol: "Trabajador"
    }
};

formularioLogin.addEventListener("submit", function(event){
    event.preventDefault();
    const usuario = campoUsuario.value.trim();
    const rolSeleccionado = campoRol.value.trim();
    const password = campoPassword.value.trim();
    
    if (usuario === "" || rolSeleccionado === "" || password === ""){
        alert("Por favor, ingrese usuario, rol y contraseña.");
        return;
    }
    const usuarioEncontrado = usuarios[usuario];
    if (!usuarioEncontrado){
        alert("Usuario o contraseña incorrectos.");
        return;
    }
    if (usuarioEncontrado.password !== password){
        alert("Usuario o contraseña incorrectos.");
        return;
    }
    if (usuarioEncontrado.rol !== rolSeleccionado){
        alert("El rol seleccionado no corresponde al usuario.");
        return;
    }

    sessionStorage.setItem("usuarioActual", usuario);
    sessionStorage.setItem("rolUsuario", usuarioEncontrado.rol);

    window.location.href = "http://127.0.0.1:5500/";
        
});