// ============================================================
// carrito.js  ·  Lógica de la página del carrito (carrito.html)
// Lee los productos guardados en localStorage, los pinta,
// calcula el total y permite confirmar el pedido.
// ============================================================

// Referencias a elementos del HTML
const section = document.querySelector("section");            // contenedor donde se pintan los productos
const btnLogin = document.getElementById("btnLogin");          // botón Login / Logout
const btnMiCuenta = document.getElementById("btnMiCuenta");    // botón "Mi cuenta"
const divCesta = document.getElementById("divCesta");          // resumen (nº productos, total y botón confirmar)
// Carrito guardado en el navegador (texto JSON) o array vacío si no hay nada
const carrito = localStorage.getItem("carrito") || [];
let carritoJson=[];
// Si hay datos, convertimos el texto JSON en un array de objetos
if(carrito.length>0 ){ carritoJson = JSON.parse(carrito)}

let precioTotal = 0;   // suma de los precios de todos los productos
let usuario = null;    // datos del usuario logueado (si lo hay)

// Pinta cada producto del carrito y el resumen con el total
function cargarCarrito() {

    // Recorremos el carrito y añadimos una "tarjeta" por cada producto
    carritoJson.forEach(carrito => {
        section.innerHTML += `<div id="divSection">
    <img src="${carrito.imagen}">
    <div id="divTexto">
    <h5>${carrito.nombre}</h5>
    <p>${carrito.precio}</p>
    </div>
    </div>
    `
        // Quitamos el símbolo € del precio, lo convertimos a número y lo sumamos al total
        precioTotal += parseFloat(carrito.precio.replace("€", ""));
    });
    /*Si el array donde se guardan las ids de los productos no tiene datos aparece un mensaje de que no hay productos en la seccion si no se hace un bucle que recorra cada id y en cada id que recorra los productos si el id es el mismo que el id del producto muestra el nombre, la imagen, el precio, y el descuento del producto */
    // Si el carrito está vacío, volvemos a la página de inicio
    if (carrito.length === 0) {
        window.location = "../HTML/index.html";
    }
    // Resumen: singular "PRODUCTO" si hay uno, plural "PRODUCTOS" si hay más
    if (carritoJson.length === 1) {
        divCesta.innerHTML += `<div class="sep"> <p>${carritoJson.length} PRODUCTO </p> <div class="borde"> </div> <p> ${precioTotal}€</p> </div> <button id="btnCarrito" onclick="confirmarPedido()" class="btnCarrito">¡Confirmar pedido!</button>`;
    } else {
        divCesta.innerHTML += `<div class="sep"> <p>${carritoJson.length} PRODUCTOS </p> <div class="borde"> </div>  <p> ${precioTotal}€  </div> </p><button id="btnCarrito" onclick="confirmarPedido()" class="btnCarrito">¡Confirmar pedido!</button><style>`;
    }
}
// Comprueba si hay un usuario logueado (guardado en localStorage). Devuelve true/false
function esLogeado() {
    const storage = localStorage.getItem("usuario");
    if (!storage) return false;

    try {
        usuario = JSON.parse(storage);
        return true;
    } catch (e) {
        // Si el dato está corrupto lo borramos
        localStorage.removeItem("usuario");
        usuario = null;
        return false;
    }
}
// Confirma el pedido: si está logueado agradece y vacía el carrito; si no, lo manda a login/registro
function confirmarPedido() {
    esLogeado()
        ? (alert("gracias por la compra"), localStorage.removeItem("carrito"), window.location.href = "productos.html")
        : (alert("por favor logeate o registrate primero "),window.location.href = "miCuenta.html")
}
// Botón Login/Logout: si hay sesión la cierra (borra usuario y carrito); si no, va a la página de cuenta
btnLogin.addEventListener("click", () => {
    if (esLogeado()) {
        localStorage.removeItem("usuario");
        localStorage.removeItem("carrito");
        btnLogin.textContent = "🔐 Login";
        btnMiCuenta.style.display = "none";
        alert("Has cerrado sesión");
    } else {
        window.location.href = "miCuenta.html";
    }
});


// Botón "Mi cuenta": navega a la página de cuenta
btnMiCuenta.addEventListener("click", () => {
    window.location.href = "miCuenta.html";
})

//arrancar 

// Al cargar la página: si hay productos los pintamos y ajustamos los botones según el login
if(carritoJson.length>0){cargarCarrito();}
esLogeado()
    ? (btnLogin.textContent = "🔓 Logout", btnMiCuenta.style.display = "block")
    : (btnMiCuenta.style.display = "none",btnLogin.textContent = "🔐 Login")
