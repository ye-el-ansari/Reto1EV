const section = document.querySelector("section");
const btnLogin = document.getElementById("btnLogin");
const btnMiCuenta = document.getElementById("btnMiCuenta");
const divCesta = document.getElementById("divCesta");
const carrito = localStorage.getItem("carrito") || [];
let carritoJson=[];
if(carrito.length>0 ){ carritoJson = JSON.parse(carrito)}

let precioTotal = 0;
let usuario = null;

function cargarCarrito() {

    carritoJson.forEach(carrito => {
        section.innerHTML += `<div id="divSection">
    <img src="${carrito.imagen}">
    <div id="divTexto">
    <h5>${carrito.nombre}</h5>
    <p>${carrito.precio}</p>
    </div>
    </div>
    `
        precioTotal += parseFloat(carrito.precio.replace("€", ""));
    });
    /*Si el array donde se guardan las ids de los productos no tiene datos aparece un mensaje de que no hay productos en la seccion si no se hace un bucle que recorra cada id y en cada id que recorra los productos si el id es el mismo que el id del producto muestra el nombre, la imagen, el precio, y el descuento del producto */
    if (carrito.length === 0) {
        window.location = "../HTML/index.html";
    }
    if (carritoJson.length === 1) {
        divCesta.innerHTML += `<div class="sep"> <p>${carritoJson.length} PRODUCTO </p> <div class="borde"> </div> <p> ${precioTotal}€</p> </div> <button id="btnCarrito" onclick="confirmarPedido()" class="btnCarrito">¡Confirmar pedido!</button>`;
    } else {
        divCesta.innerHTML += `<div class="sep"> <p>${carritoJson.length} PRODUCTOS </p> <div class="borde"> </div>  <p> ${precioTotal}€  </div> </p><button id="btnCarrito" onclick="confirmarPedido()" class="btnCarrito">¡Confirmar pedido!</button><style>`;
    }
}
function esLogeado() {
    const storage = localStorage.getItem("usuario");
    if (!storage) return false;

    try {
        usuario = JSON.parse(storage);
        return true;
    } catch (e) {
        localStorage.removeItem("usuario");
        usuario = null;
        return false;
    }
}
function confirmarPedido() {
    esLogeado()
        ? (alert("gracias por la compra"), localStorage.removeItem("carrito"), window.location.href = "productos.html")
        : (alert("por favor logeate o registrate primero "),window.location.href = "miCuenta.html")
}
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


btnMiCuenta.addEventListener("click", () => {
    window.location.href = "miCuenta.html";
})

//arrancar 

if(carritoJson.length>0){cargarCarrito();}
esLogeado()
    ? (btnLogin.textContent = "🔓 Logout", btnMiCuenta.style.display = "block")
    : (btnMiCuenta.style.display = "none",btnLogin.textContent = "🔐 Login")