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
const usuario = document.getElementById("usuario");
const correo = document.getElementById("correo");
const contrasenia = document.getElementById("contrasenia");
const correoLabel = document.querySelector(".correo");
const confirmarcontrasenia = document.querySelector(".confirmarContrasenia");
const password=document.getElementById("confirmarContrasenia")
const error = document.getElementById("error");
const btnModificar = document.getElementById("modificar");
const btnEliminar = document.getElementById("eliminar");
const form = document.getElementById("form");
const divBotones=document.querySelector(".tabs-container")
const url = "http://127.0.0.1:3000";


let logeado = false;
let usuarios = [];
let user = null;

async function iniciar() {
  usuarios = await cargarUsuarios();
  esLogeado() ? rellenarDatosUsuario(user.id) : vistaLogin();
}

async function cargarUsuarios() {
  try {
    const response = await fetch(url + "/usuarios");
    if (!response.ok) {
      throw new Error("hibo un error al cargar los usuarios", response.status);
    }
    return await response.json();
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    return [];
  }
}

async function crearUsuario(datos) {
  try {
    const res = await fetch(url + "/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    if (!res.ok) {
      throw new Error("Hubo un error al crear usuario: " + res.status);
    }

   
  } catch (err) {
    console.error("Error en crearUsuario:", err);
  }
}
async function modificarUsuario(datos) {

  try{
  const res = await fetch(url + "/usuarios/" + datos.id, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      id: datos.id,
      nombre: datos.nombre,
      contrasenia: datos.contrasenia,
      correo: datos.correo
    }),
  });
  if (!res.ok) {
    throw new Erro("hubo un error al modificar usuario" + res.status);
  }
   const usuarioModificado = await res.json();
   user = { ...user, ...usuarioModificado };
   storageUser(user);
    return true;
}catch(e){
   console.log("Error en modificarUsuario:");
   return null;
}
}
async function eliminarCuenta(datos) {
  const res = fetch(url + "/usuarios/" + datos.id, {
    method: "DELETE",
    headers: { "content-type": "application/json" },
  });
  if (!res.ok) {
    throw new Error("hubo un error al eliminar el usuario");
  }
  localStorage.removeItem(user);
    window.location.href = "productos.html";
  alert("Cuenta eliminada con éxito");


}
function esLogeado() {
  const storage = localStorage.getItem("usuario");
  if (!storage) return false;

  try {
    user = null;
    user = JSON.parse(storage);
    logeado = true;
    console.log(user);
    return true;
  } catch (e) {
    localStorage.removeItem("usuario");
    localStorage.removeItem("carrito");
    usuario = null;
    logeado = false;
    return false;
  }
}
function storageUser(datosUsuario) {
  localStorage.setItem("usuario", JSON.stringify(datosUsuario));
  console.log("user:" + datosUsuario + " logeado");
}

function rellenarDatosUsuario(id) {
  contrasenia.type = "text";
  btnEntrar.style.display = "none";
  const us = usuarios.find((u) => u.id === id);
  correo.style.display = "block";
  iniciarSesion.style.display = "none";
  registrarse.style.display = "none";
  btnModificar.style.display = "block";
  btnEliminar.style.display = "block";
  confirmarcontrasenia.style.display = "none";

  usuario.value = us.nombre;
  correo.value = us.correo;
  contrasenia.value = us.contrasenia;
}

function vistaLogin() {
  vaciarCampos();
  contrasenia.type = "password";
  btnEntrar.style.display = "block";
  iniciarSesion.style.display = "block";
  contrasenia.style.display = "block"
  correo.style.display = "none";
  registrarse.style.display = "block";
  btnModificar.style.display = "none";
  btnEliminar.style.display = "none";
  confirmarcontrasenia.style.display = "none";
  usuario.setAttribute("required", "true");
  correo.removeAttribute("required");
  confirmarcontrasenia.removeAttribute("required");
  correoLabel.style.display = "none";
}

function vistaRegistrar() {
  vaciarCampos();
  contrasenia.type = "text";
  btnEntrar.style.display = "block";
  correo.style.display = "block";
  iniciarSesion.style.display = "block";
  registrarse.style.display = "block";
  btnModificar.style.display = "none";
  btnEliminar.style.display = "none";
  confirmarcontrasenia.style.display = "block";
  usuario.setAttribute("required", "true");
  contrasenia.setAttribute("required", "true");
  correo.setAttribute("required", "true");
  confirmarcontrasenia.setAttribute("required", "true");
  correoLabel.style.display = "block";
}


function vaciarCampos() {
  usuario.value = "";
  contrasenia.value = "";
  correo.value = "";
  confirmarcontrasenia.value = "";
  error.innerHTML = "";
}

function loginCheck(nombre, pass) {
  return usuarios.find((u) => u.nombre === nombre && u.contrasenia === pass);
}

// 4. Listeners de eventos
iniciar();
iniciarSesion.addEventListener("click", () => {
  error.style.display = "none";
  error.innerHTML = "";
  btnEntrar.value = "Iniciar";
  vistaLogin();
});
registrarse.addEventListener("click", () => {
  btnEntrar.value = "Registrar";
  error.style.display = "none";
  error.innerHTML = "";
  vistaRegistrar();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  error.style.display = "none";

  error.innerHTML = "";
  const nombre = usuario.value.toLowerCase().trim() || "";
  const pass = contrasenia.value.trim() || "";
  const pass2 = password.value.trim() || "";
  const email = correo.value.toLowerCase().trim() || "";
  console.log(pass,"|",pass2)
  if (btnEntrar.value === "Iniciar") {
    if ((user = loginCheck(nombre, pass))) {
    
      storageUser(user);
      window.location.href = "../HTML/productos.html";
      return;
    }
    error.textContent = "Datos intoducidos incorectos!";
    error.style.display = "block";
    return;
  } else {

    if (pass !== pass2) {
      error.textContent = "Contraseñeas no coinciden!";
      error.style.display = "block";
      return;
    } else {
      const addUser = {
        contrasenia: pass,
        nombre: nombre,
        correo: email,
      };
      await crearUsuario(addUser);
      alert("Usuario registrado correctamente");
      btnEntrar.value = "Iniciar";
      vistaLogin();
    }
  }
});

btnModificar.addEventListener("click", async (e) => {
e.preventDefault()
  error.style.display = "none";
 const nombre = usuario ? usuario.value.toLowerCase().trim() : "";
  const pass = contrasenia ? contrasenia.value.trim() : "";
  const email = correo ? correo.value.trim() : "";
  if (!user || !user.id) {
    alert(" no se encuentra el usuario para modificar!");
    return;
  }
   const updateUser = {
        id:user.id,
        contrasenia: pass,
        nombre: nombre,
        correo: email,
      };
  if(await modificarUsuario(updateUser)){
      window.location.href = "productos.html";
    alert("modificando correctamente")


  }
  else{
    error.textContent="no se ha podido modificar el usuario correctamente";
    error.style.display = "block";
  }
});

btnEliminar.addEventListener("click", async () => {
  error.style.display = "none";
  confirm("Seguro que quieres eliminar tu cuenta")
    ? await eliminarCuenta(user)
    :"";
  error.style.display = "block";
});


