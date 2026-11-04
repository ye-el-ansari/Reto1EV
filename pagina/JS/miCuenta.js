/*if (localStorage.getItem("usuario")) {
    window.location = "../HTML/carrito.html";
} else {
    const iniciarSesion = document.getElementById("iniciarSesion");
    const registrarse = document.getElementById("registrarse");
    const form = document.querySelector("form");
    const usuario = document.querySelectorAll(".usuario");
    const correo = document.querySelectorAll(".correo");
    const contrasenia = document.querySelectorAll(".contrasenia");
    const confirmarcontrasenia = document.querySelectorAll(".confirmarcontrasenia");
    const error = document.getElementById("error");
    let conf = false;
    let usuarios = [];


    function storageUser(nombre) {
        usuarios = { "nombre":nombre }
        localStorage.setItem("usuario", JSON.stringify(usuarios));
        console.log(usuarios.nombre);

    }
    
    fetch("http://localhost:3000/usuarios")
        .then(response => {
            if (!response.ok) {
                alert("No respondió el servidor");
            }
            return response.json();
        })
        .then(datos => {
            for (let i = 0; i < datos.length; i++) {
                console.log(datos[i]);
                if (datos[i].nombre === usuario.value && datos[i].contrasenia === correo.value) {
                    conf = true;
                    storageUser(datos[i].nombre);break;
                }

            }
            if (!conf) { alert("contrasenia o usuario incorecto"); return; }


        });
    registrarse.addEventListener("click", function (e) {
        usuario[1].value = "";
        correo[1].value = "";

        e.preventDefault();
        registrarse.style.boxShadow = "0px 0px 10px 5px #ff5500";
        iniciarSesion.style.boxShadow = "";
        contrasenia.forEach((input) => {
            input.style.display = "block";
        });
        confirmarcontrasenia.forEach((input) => {
            input.style.display = "block";
        });

    });
        iniciarSesion.addEventListener("click", function (e) {
        usuario[1].value = "";
        correo[1].value = "";
        contrasenia[1].value = "";
        confirmarcontrasenia[1].value = "";
        error.style.display = "none";
        e.preventDefault();
        iniciarSesion.style.boxShadow = "0px 0px 10px 5px #ff5500";
        registrarse.style.boxShadow = "";
        confirmarcontrasenia.forEach((input) => {
            input.style.display = "none";
        });
        usuario.forEach((input) => {
            input.style.display = "block";
        });
        contrasenia.forEach((input) => {
            input.style.display = "none";
        });

    });
  
        if (usuario[1].value && correo[1].value && contrasenia[1].value && confirmarcontrasenia[1].value) {
            e.preventDefault();
            const datos = {
                "usuario": usuario[1].value,
                "correo": correo[1].value,
                "contrasenia": contrasenia[1].value
            };
            for (let i = 0; i < usuarios.length; i++) {
                if (usuarios[i].usuario === usuario[1].value && usuarios[i].correo === correo[1].value) {
                    conf = true;
                }
            }

            if (conf) {
                error.style.display = "block";
                return;
            }
            e.target.submit();
            await fetch("http://localhost:3000/usuarios", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(datos)

            });


        } else if (usuario[1].value && correo[1].value) {
            for (let i = 0; i < usuarios.length; i++) {
                if (usuario[1].value === usuarios[i].usuario && correo[1].value === usuarios[i].correo) {
                    localStorage.setItem("usuario", JSON.stringify(usuarios[i]));
                    e.target.submit();
                }
            }

        }

    });
}*/
const iniciarSesion = document.getElementById("iniciarSesion");
const registrarse = document.getElementById("registrarse");
const btnEntrar = document.querySelector("#entrar");
const usuario = document.querySelector(".usuario");
const correo = document.querySelector(".correo");
const contrasenia = document.querySelector(".contrasenia");
const confirmarcontrasenia = document.querySelector(".confirmarContrasenia");
const error = document.getElementById("error");
const btnModificar=document.getElementById("modificar");
const btnEliminar=document.getElementById("eliminar");

let logeado = false;
let usuarios = null;
let user = null;


async function iniciar() {
    usuarios = await cargarUsuarios();
    esLogeado() ? rellenarDatosUsuario(user.id) : vistaLogin();

}

async function cargarUsuarios() {
    try {
        const response = await fetch("http://localhost:3000/usuarios");
        if (!response.ok) {
            alert("No respondió el servidor");
            return [];
        }
        return await response.json();
    } catch (err) {
        console.error("Error al obtener usuarios:", err);
        return [];
    }
}

async function registrarNuevoUsuario(datos) {
    await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(datos)
    });
}

function esLogeado() {
    const storage = localStorage.getItem("usuario");
    if (!storage) return false;

    try {
        user = null;
        user = JSON.parse(storage);
        logeado=true;
        return true;
    } catch (e) {
        localStorage.removeItem("usuario");
        usuario = null;
        logeado=false;
        return false;
    }
}
function storageUser(datosUsuario) {
    localStorage.setItem("usuario", JSON.stringify(datosUsuario));
    console.log("user:" + datosUsuario + " logeado")
}

function rellenarDatosUsuario(id) {
    const us=usuarios.find(u=>u.id===id);
    correo.style.display="block";
    iniciarSesion.style.display="none";
    registrarse.style.display="none";
    btnModificar.style.display="block";
    btnEliminar.style.display="block";
    confirmarcontrasenia.style.display="none";

    usuario.value=us.nombre;
    correo.value=us.correo;
    contrasenia.value=us.contrasenia;

}

function vistaLogin(){
    vaciarCampos();
    iniciarSesion.style.display="block";
    correo.style.display="none";
    registrarse.style.display="block";
    btnModificar.style.display="none";
    btnEliminar.style.display="none";
    confirmarcontrasenia.style.display="none";
}

function vistaRegistrar(){
    vaciarCampos();
     correo.style.display="block";
    iniciarSesion.style.display="block";
    registrarse.style.display="block";
    btnModificar.style.display="none";
    btnEliminar.style.display="none";
    confirmarcontrasenia.style.display="block";
}

function vaciarCampos(){
    usuario.value="";
    contrasenia.value="";
    correo.value="";
    confirmarcontrasenia.value="";
}

function loginCheck(nombre,pass){
return usuarios.find(u=>u.nombre===nombre && u.contrasenia===pass);
}

// 4. Listeners de eventos


iniciarSesion.addEventListener("click",()=>{
    vistaLogin();
})
registrarse.addEventListener("click",()=>{
vistaRegistrar();
})

btnEntrar.addEventListener("click",()=>{
if(!logeado){
    const nombre=nombre.value().toLowerCase().trim();
    const pass=contrasenia.value().trim();
    if(user=loginCheck(nombre,pass)){
        storageUser(user);
        window.location.href="../HTML/carrito.html";
        return;
    }
    alert("Datos incorectos!");
    return;
}
else {
    const nombre=nombre.value().toLowerCase().trim();
    const pass=contrasenia.value().trim();
    const pass2=confirmarcontrasenia.value().trim();
    const email=correo.value().toLowerCase().trim();
    if(pass!==pass2){alert("las contrasena no coinciden");return;}
    
}
})

