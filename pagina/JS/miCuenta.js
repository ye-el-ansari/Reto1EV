// ============================================================
// miCuenta.js  ·  Lógica de la página de cuenta (miCuenta.html)
// Login, registro, modificar datos y eliminar cuenta usando
// la API json-server (/usuarios) y localStorage para la sesión.
// ============================================================

// Referencias a elementos del formulario y botones
const iniciarSesion = document.getElementById("iniciarSesion");   // pestaña "Iniciar sesión"
const registrarse = document.getElementById("registrarse");       // pestaña "Registrarse"
const btnEntrar = document.querySelector("#entrar");              // botón principal (Iniciar / Registrar)
const usuario = document.getElementById("usuario");               // campo nombre de usuario
const correo = document.getElementById("correo");                 // campo correo
const contrasenia = document.getElementById("contrasenia");       // campo contraseña
const correoLabel = document.querySelector(".correo");            // etiqueta/grupo del correo
const confirmarcontrasenia = document.querySelector(".confirmarContrasenia"); // grupo "confirmar contraseña"
const password = document.getElementById("confirmarContrasenia")  // campo confirmar contraseña
const error = document.getElementById("error");                   // mensaje de error
const btnModificar = document.getElementById("modificar");        // botón "Actualizar datos"
const btnEliminar = document.getElementById("eliminar");          // botón "Eliminar cuenta"
const form = document.getElementById("form");                     // formulario completo
const divBotones = document.querySelector(".tabs-container");     // contenedor de las pestañas
const btnLogin = document.getElementById("btnLogin");             // botón Logout del header
const btnInicio = document.getElementById("btnInicio");           // botón Inicio del header
const btnContrasenia = document.getElementById("btnContrasenia"); // interruptor mostrar/ocultar contraseña
const statusContrasenia = document.getElementById("passStatus");  // texto "Mostrar/Ocultar"
const url = "http://127.0.0.1:3000";   // dirección de la API (json-server)


let logeado = false;   // true si hay sesión iniciada
let usuarios = [];     // lista de usuarios cargada de la API
let user = null;       // usuario actual

// Arranque: carga usuarios; si hay sesión muestra sus datos, si no muestra el login
async function iniciar() {
  usuarios = await cargarUsuarios();
  esLogeado() ? rellenarDatosUsuario(user.id) : vistaLogin();
}

// GET: pide todos los usuarios a la API (devuelve [] si falla)
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

// POST: crea un usuario nuevo en la API (registro)
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
// PUT: actualiza nombre, contraseña y correo del usuario y guarda el resultado en localStorage
async function modificarUsuario(datos) {

  try {
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
    // Mezclamos los datos antiguos con los nuevos y los guardamos
    user = { ...user, ...usuarioModificado };
    storageUser(user);
    return true;
  } catch (e) {
    console.log("Error en modificarUsuario:");
    return null;
  }
}
// DELETE: elimina la cuenta del usuario, cierra la sesión y vuelve al inicio
async function eliminarCuenta(datos) {
  const res = await fetch(url + "/usuarios/" + datos.id, {
    method: "DELETE",
    headers: { "content-type": "application/json" },
  });
  if (!res.ok) {
    throw new Error("hubo un error al eliminar el usuario");
  }
  localStorage.removeItem("usuario");
  window.location.href = "index.html";
  alert("Cuenta eliminada con éxito");


}
// Comprueba en localStorage si hay un usuario logueado y lo carga en "user"
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
    usuarios = null;
    logeado = false;
    return false;
  }
}
// Guarda el usuario en localStorage (así se mantiene la sesión entre páginas)
function storageUser(datosUsuario) {
  localStorage.setItem("usuario", JSON.stringify(datosUsuario));
  console.log("user:" + datosUsuario + " logeado");
}

// Vista de usuario logueado: muestra sus datos y los botones Actualizar / Eliminar
function rellenarDatosUsuario(id) {
  btnLogin.style.display = "";
  btnEntrar.style.display = "none";
  // Buscamos en la lista el usuario con ese id
  const us = usuarios.find((u) => u.id === id);
  console.log(us);
  correo.style.display = "block";
  divBotones.style.display = "none";
  iniciarSesion.style.display = "none";
  registrarse.style.display = "none";
  btnModificar.style.display = "block";
  btnEliminar.style.display = "block";
  confirmarcontrasenia.style.display = "none";

  // Rellenamos los campos con los datos del usuario
  usuario.value = us.nombre;
  correo.value = us.correo;
  contrasenia.value = us.contrasenia;
}

// Vista de login: solo usuario y contraseña
function vistaLogin() {
  vaciarCampos();
  btnLogin.style.display = "none";
  btnEntrar.style.display = "block";
  divBotones.style.display = "flex";
  iniciarSesion.style.display = "block";
  contrasenia.style.display = "block"
  correo.style.display = "none";
  registrarse.style.display = "block";
  btnModificar.style.display = "none";
  btnEliminar.style.display = "none";
  confirmarcontrasenia.style.display = "none";
  // En el login el correo no es obligatorio
  usuario.setAttribute("required", "true");
  correo.removeAttribute("required");
  confirmarcontrasenia.removeAttribute("required");
  correoLabel.style.display = "none";
}

// Vista de registro: añade correo y confirmación de contraseña (todos obligatorios)
function vistaRegistrar() {
  vaciarCampos();
  btnEntrar.style.display = "block";
  divBotones.style.display = "flex";
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


// Limpia todos los campos del formulario y el mensaje de error
function vaciarCampos() {
  usuario.value = "";
  contrasenia.value = "";
  correo.value = "";
  confirmarcontrasenia.value = "";
  error.innerHTML = "";
}

// Busca un usuario cuyo nombre y contraseña coincidan (devuelve el usuario o undefined)
function loginCheck(nombre, pass) {
  return usuarios.find((u) => u.nombre === nombre && u.contrasenia === pass);
}

// 4. Listeners de eventos
iniciar();
// Pestaña "Iniciar sesión": cambia a la vista de login
iniciarSesion.addEventListener("click", () => {
  error.style.display = "none";
  error.innerHTML = "";
  btnEntrar.value = "Iniciar";
  vistaLogin();
});
// Pestaña "Registrarse": cambia a la vista de registro
registrarse.addEventListener("click", () => {
  btnEntrar.value = "Registrar";
  error.style.display = "none";
  error.innerHTML = "";
  vistaRegistrar();
});

// Envío del formulario: según el texto del botón hace LOGIN o REGISTRO
form.addEventListener("submit", async (e) => {
  e.preventDefault();   // evita que el formulario recargue la página
  error.style.display = "none";

  error.innerHTML = "";
  // Leemos y limpiamos los datos (minúsculas y sin espacios sobrantes)
  const nombre = usuario.value.toLowerCase().trim() || "";
  const pass = contrasenia.value.trim() || "";
  const pass2 = password.value.trim() || "";
  const email = correo.value.toLowerCase().trim() || "";
  console.log(pass, "|", pass2)
  if (btnEntrar.value === "Iniciar") {
    // LOGIN: si los datos son correctos guardamos la sesión y vamos al inicio
    if ((user = loginCheck(nombre, pass))) {

      storageUser(user);
      window.location.href = "../HTML/index.html";
      return;
    }
    error.textContent = "Datos intoducidos incorectos!";
    error.style.display = "block";
    return;
  } else {

    // REGISTRO: las dos contraseñas deben coincidir
    if (pass !== pass2) {
      error.textContent = "Contraseñeas no coinciden!";
      error.style.display = "block";
      return;
    } else {
      // Creamos el usuario nuevo en la API y volvemos a la vista de login
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

// Botón "Actualizar datos": envía los datos modificados a la API
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
    id: user.id,
    contrasenia: pass,
    nombre: nombre,
    correo: email,
  };
  if (await modificarUsuario(updateUser)) {
    window.location.href = "productos.html";
    alert("modificando correctamente")


  }
  else {
    error.textContent = "no se ha podido modificar el usuario correctamente";
    error.style.display = "block";
  }
});

// Botón "Eliminar cuenta": pide confirmación y, si acepta, borra la cuenta
btnEliminar.addEventListener("click", async () => {
  error.style.display = "none";
  confirm("Seguro que quieres eliminar tu cuenta")
    ? await eliminarCuenta(user)
    : "";
  error.style.display = "block";
});

// Botón Logout: cierra la sesión (borra usuario y carrito) y vuelve al inicio
btnLogin.addEventListener("click", () => {
  localStorage.removeItem("usuario");
  localStorage.removeItem("carrito")
  logeado = false;
  alert("Has cerrado sesión");
  window.location.href = "index.html";
})
// Botón Inicio: vuelve a la portada
btnInicio.addEventListener("click", () => {
  window.location.href = "index.html"
})
// Interruptor mostrar/ocultar contraseña
btnContrasenia.addEventListener("click", () => {
  // Comprobamos si el campo es de tipo password
  const esOculto = contrasenia.type === "password";

  if (esOculto) {
    // MOSTRAR CONTRASEÑA (Activar switch)
    contrasenia.type = "text";
    password.type = "text";
    statusContrasenia.textContent = "Ocultar";
    btnContrasenia.classList.add("active");
    statusContrasenia.classList.add("active");
  } else {
    // OCULTAR CONTRASEÑA (Desactivar switch)
    contrasenia.type = "password";
    password.type = "password";
    statusContrasenia.textContent = "Mostrar";
    btnContrasenia.classList.remove("active");
    statusContrasenia.classList.remove("active");
  }
});
