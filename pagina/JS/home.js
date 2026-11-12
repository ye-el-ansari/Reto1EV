// ============================================================
// home.js  ·  Lógica de la página de inicio (index.html)
// Carga los productos desde la API (json-server), muestra los 6
// con mayor descuento y gestiona login y contador de la cesta.
// ============================================================

// Pide los productos a la API, elige los 6 con más descuento y los pinta
async function cargarProductos() {
    // 1. Traemos los datos de la API
    const respuesta = await fetch('http://localhost:3000/productos');
    const listaProductos = await respuesta.json(); // Recuerda que json-server devuelve el array directo

    const seisMejoresDescuentos = [];

    // 2. Buscamos los 6 mejores manualmente
    // Repetimos 6 veces: en cada vuelta sacamos el producto con mayor descuento
    for (let i = 0; i < 6; i++) {
        let posicionDelMayor = 0;
        let descuentoMayor = -1;

        // Recorremos la lista y nos quedamos con el descuento más alto
        listaProductos.forEach((producto, indice) => {
            // parseInt("17%") -> 17 ; si no hay número, 0
            let descuentoActual = parseInt(producto.descuento) || 0;
            if (descuentoActual > descuentoMayor) {
                descuentoMayor = descuentoActual;
                posicionDelMayor = indice;
            }
        });

        let elProductoMasAlto = listaProductos[posicionDelMayor];
        if (elProductoMasAlto) {
            // Lo guardamos y lo quitamos de la lista para que no se repita en la siguiente vuelta
            seisMejoresDescuentos.push(elProductoMasAlto);
            listaProductos.splice(posicionDelMayor, 1);
        }
    }

    // 3. Mostramos las tarjetas en el HTML
    const contenedor = document.querySelector('.cards');
    contenedor.innerHTML = ''; // Vaciamos el contenedor

    // Creamos una tarjeta por cada producto seleccionado
    seisMejoresDescuentos.forEach(producto => {
        // A) Creamos la caja de la tarjeta en memoria
        const tarjetaDiv = document.createElement('div');
        tarjetaDiv.className = 'card';

        // B) Le metemos tu estructura HTML exacta
        tarjetaDiv.innerHTML = `
            <img src="${producto.imagen}" />
            <h3>${producto.nombre}</h3>
            <h2 class="price">${producto.precio}</h2>
            <p class="discount">${producto.descuento} descuento</p>
            <button class="btn-cesta">Anadir a la cesta</button>
        `;
        /*
                // C) Buscamos el botón que acabamos de escribir AQUÍ MISMO y le programamos el click
                const boton = tarjetaDiv.querySelector('.btn-cesta');
                boton.addEventListener('click', () => {
                    
                    // Traemos lo que ya haya en el carrito o empezamos de cero []
                    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
                    
                    // Añadimos este producto específico
                    carrito.push(producto);
                    
                    // Guardamos en el almacenamiento de sesión
                    localStorage.setItem('carrito', JSON.stringify(carrito));
                    
                    // Alertas de confirmación
                    alert(`¡"${producto.nombre}" se ha añadido al carrito!`);
                    console.log("Contenido del carrito:", carrito);
                });
        */
        //
        // Botón "Añadir a la cesta": al hacer clic guarda este producto en el carrito
        const boton = tarjetaDiv.querySelector('.btn-cesta');
        boton.addEventListener("click", () => {
            anyadirAlCesta(producto);
        })
        // D) Metemos la tarjeta con su botón ya listo dentro de tu página
        contenedor.appendChild(tarjetaDiv);
    });
    
}

//variables globales necesarrios para la funcionalidad de la applicacion
const countCesta = document.getElementById("cartCount");       // número de productos junto a "Cesta"
const btnLogin = document.getElementById("btnLogin");          // botón Login / Logout
const btnMiCuenta=document.getElementById("btnMiCuenta");      // botón "Mi cuenta"
let carritoContador = 0;   // cantidad de productos en la cesta
let logeado = false;       // true si hay usuario logueado
let cesta = [];            // array con los productos de la cesta
//funciones necesarios para contar los productos anadidos y controlar el estado del login

// Función de arranque: carga productos, actualiza el contador y ajusta los botones de usuario
async function iniciar() {
    await cargarProductos();
    carrito();

    esLogeado() ? (btnLogin.textContent = "🔓 Logout", btnMiCuenta.style.display = "block") : btnMiCuenta.style.display = "none";

}
//para calcular los productos anadidos al cesta
// Lee la cesta de localStorage y actualiza el contador visible
function carrito() {
    const storage = localStorage.getItem("carrito");
    if (!storage) { cesta = []; return false; }
    try {
        cesta = JSON.parse(storage);
        carritoContador = cesta.length;
        countCesta.textContent = carritoContador
        return true;
    } catch (e) {
        // Si el dato guardado está dañado se limpia
        localStorage.removeItem("carrito");
        cesta = [];
        carritoContador = 0;
        return false;
    }
}
//para controlar el carrito en  el localstorage 
// Añade un producto a la cesta, lo guarda en localStorage y actualiza el contador
function anyadirAlCesta(product) {
    carrito();
    cesta.push(product);
    localStorage.setItem("carrito", JSON.stringify(cesta));
    countCesta.textContent = cesta.length;
     alert(" se ha anadido"+product.nombre);
}
//para el estado del login
// Comprueba si hay un usuario guardado en localStorage (sesión iniciada)
function esLogeado() {
    const storage = localStorage.getItem("usuario");
    if (!storage) return false;

    try {
        usuario = JSON.parse(storage);
        logeado = true;
        carrito();
        return true;
    } catch (e) {
        localStorage.removeItem("usuario");
        usuario = null;
        logeado = false;
        return false;
    }
}
//btn login
// Login/Logout: si hay sesión la cierra y limpia datos; si no, lleva a la página de cuenta
btnLogin.addEventListener("click", () => {
  if (esLogeado()) {
    localStorage.removeItem("usuario");
     localStorage.removeItem("carrito")
     cesta=null;
     logeado=false;
    btnLogin.textContent = "🔐 Login";
    btnMiCuenta.style.display="none";
    countCesta.textContent=0;
    alert("Has cerrado sesión");
  } else {
    window.location.href = "miCuenta.html";
  }
});


// "Mi cuenta": navega a la página de cuenta
btnMiCuenta.addEventListener("click",()=>{
window.location.href="miCuenta.html";
})

// Encendemos la función al cargar la página
iniciar();
