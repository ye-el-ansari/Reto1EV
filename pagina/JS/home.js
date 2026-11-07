async function cargarProductos() {
    // 1. Traemos los datos de la API
    const respuesta = await fetch('http://localhost:3000/productos');
    const listaProductos = await respuesta.json(); // Recuerda que json-server devuelve el array directo

    const seisMejoresDescuentos = [];

    // 2. Buscamos los 6 mejores manualmente
    for (let i = 0; i < 6; i++) {
        let posicionDelMayor = 0;
        let descuentoMayor = -1;

        listaProductos.forEach((producto, indice) => {
            let descuentoActual = parseInt(producto.descuento) || 0;
            if (descuentoActual > descuentoMayor) {
                descuentoMayor = descuentoActual;
                posicionDelMayor = indice;
            }
        });

        let elProductoMasAlto = listaProductos[posicionDelMayor];
        if (elProductoMasAlto) {
            seisMejoresDescuentos.push(elProductoMasAlto);
            listaProductos.splice(posicionDelMayor, 1);
        }
    }

    // 3. Mostramos las tarjetas en el HTML
    const contenedor = document.querySelector('.cards');
    contenedor.innerHTML = ''; // Vaciamos el contenedor

    seisMejoresDescuentos.forEach(producto => {
        // A) Creamos la caja de la tarjeta en memoria
        const tarjetaDiv = document.createElement('div');
        tarjetaDiv.className = 'card';

        // B) Le metemos tu estructura HTML exacta
        tarjetaDiv.innerHTML = `
            <img src="${producto.imagen}" />
            <h3>${producto.nombre}</h3>
            <h2 class="price">${producto.precio}</h2>
            <p class="discount">${producto.descuento}% de descuento</p>
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
        const boton = tarjetaDiv.querySelector('.btn-cesta');
        boton.addEventListener("click", () => {
            anyadirAlCesta(producto);
        })
        // D) Metemos la tarjeta con su botón ya listo dentro de tu página
        contenedor.appendChild(tarjetaDiv);
    });
    
}

//variables globales necesarrios para la funcionalidad de la applicacion
const countCesta = document.getElementById("cartCount");
const btnLogin = document.getElementById("btnLogin");
const btnMiCuenta=document.getElementById("btnMiCuenta");
let carritoContador = 0;
let logeado = false;
let cesta = [];
//funciones necesarios para contar los productos anadidos y controlar el estado del login

async function iniciar() {
    await cargarProductos();
    carrito();

    esLogeado() ? (btnLogin.textContent = "🔓 Logout", btnMiCuenta.style.display = "block") : btnMiCuenta.style.display = "none";

}
//para calcular los productos anadidos al cesta
function carrito() {
    const storage = localStorage.getItem("carrito");
    if (!storage) { cesta = []; return false; }
    try {
        cesta = JSON.parse(storage);
        carritoContador = cesta.length;
        countCesta.textContent = carritoContador
        return true;
    } catch (e) {
        localStorage.removeItem("carrito");
        cesta = [];
        carritoContador = 0;
        return false;
    }
}
//para controlar el carrito en  el localstorage 
function anyadirAlCesta(product) {
    carrito();
    cesta.push(product);
    localStorage.setItem("carrito", JSON.stringify(cesta));
    countCesta.textContent = cesta.length;
}
//para el estado del login
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


btnMiCuenta.addEventListener("click",()=>{
window.location.href="miCuenta.html";
})

// Encendemos la función al cargar la página
iniciar();