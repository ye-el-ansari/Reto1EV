const iniciarSesion = document.getElementById("iniciarSesion");
const registrarse = document.getElementById("registrarse");
const btnEntrar = document.querySelector("#entrar");
const usuario = document.getElementById("usuario");
const correo = document.getElementById("correo");
const contrasenia = document.getElementById("contrasenia");
const correoLabel = document.querySelector(".correo");
const confirmarcontrasenia = document.querySelector(".confirmarContrasenia");
const password = document.getElementById("confirmarContrasenia")
const error = document.getElementById("error");
const btnModificar = document.getElementById("modificar");
const btnEliminar = document.getElementById("eliminar");
const form = document.getElementById("form");
const divBotones = document.querySelector(".tabs-container");
const btnLogin = document.getElementById("btnLogin");
const btnInicio = document.getElementById("btnInicio");
const btnContrasenia = document.getElementById("btnContrasenia");
const statusContrasenia = document.getElementById("passStatus");
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
    user = { ...user, ...usuarioModificado };
    storageUser(user);
    return true;
  } catch (e) {
    console.log("Error en modificarUsuario:");
    return null;
  }
}
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
function storageUser(datosUsuario) {
  localStorage.setItem("usuario", JSON.stringify(datosUsuario));
  console.log("user:" + datosUsuario + " logeado");
}

function rellenarDatosUsuario(id) {
  btnLogin.style.display = "";
  btnEntrar.style.display = "none";
  const us = usuarios.find((u) => u.id === id);
  console.log(us);
  correo.style.display = "block";
  divBotones.style.display = "none";
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
  usuario.setAttribute("required", "true");
  correo.removeAttribute("required");
  confirmarcontrasenia.removeAttribute("required");
  correoLabel.style.display = "none";
}

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
  console.log(pass, "|", pass2)
  if (btnEntrar.value === "Iniciar") {
    if ((user = loginCheck(nombre, pass))) {

      storageUser(user);
      window.location.href = "../HTML/index.html";
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

btnEliminar.addEventListener("click", async () => {
  error.style.display = "none";
  confirm("Seguro que quieres eliminar tu cuenta")
    ? await eliminarCuenta(user)
    : "";
  error.style.display = "block";
});

btnLogin.addEventListener("click", () => {
  localStorage.removeItem("usuario");
  localStorage.removeItem("carrito")
  logeado = false;
  alert("Has cerrado sesión");
  window.location.href = "index.html";
})
btnInicio.addEventListener("click", () => {
  window.location.href = "index.html"
})
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
