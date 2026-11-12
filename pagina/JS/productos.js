// ============================================================
// productos.js  ·  Lógica de la página de productos (productos.html)
// Carga el catálogo desde la API, lo pinta en tarjetas, aplica
// filtros (marca, precio, tipo) y gestiona login y cesta.
// ============================================================

// Referencias a elementos del HTML
const btnLogin = document.getElementById("btnLogin");          // botón Login / Logout
const btnCesta = document.getElementById("cartBtn");           // botón de la cesta
const countCesta = document.getElementById("cartCount");       // contador de productos de la cesta
const btnHeader = document.getElementById("header-button");    // menú de categorías (Inicio, Ordenadores...)
const sidebarFiltro = document.querySelector(".sidebar");      // panel lateral de filtros
const section = document.querySelector(".cards");              // contenedor de las tarjetas de producto
const btnMiCuenta=document.getElementById("btnMiCuenta");      // botón "Mi cuenta"

const url = "http://localhost:3000";   // dirección de la API (json-server)
let productos = [];      // todos los productos cargados de la API
let filtrados = [];      // productos tras aplicar un filtro
let cesta = [];          // productos añadidos a la cesta
let usuario=null;        // usuario logueado
let logeado=false;       // true si hay sesión
let carritoContador=0;   // nº de productos en la cesta



// Pide la lista de productos a la API y la guarda en la variable "productos"
async function cargarProductos() {
    const res = await fetch(`${url}/productos`);
    if (!res.ok) {
        throw new Error("hubo un error al cargar los productos");
    }
    productos = await res.json();
}
// Función de arranque: carga productos, los pinta y ajusta botones según el login
async function iniciar() {
    await cargarProductos();
    crearCards(productos);
    carrito();

    esLogeado() ? (btnLogin.textContent="🔓 Logout",btnMiCuenta.style.display="block"):"";

}

// Comprueba en localStorage si hay un usuario logueado
function esLogeado() {
    const storage = localStorage.getItem("usuario");
    if (!storage) return false;
    
    try {
        usuario = JSON.parse(storage);
        logeado=true;
         carrito();
        return true;
    } catch (e) {
        localStorage.removeItem("usuario");
        usuario = null;
        logeado=false;
        return false;
    }
}

// Lee la cesta de localStorage y actualiza el contador visible
function carrito(){
    const storage=localStorage.getItem("carrito");
    if(!storage){ cesta=[];return false;}
    try{
        cesta=JSON.parse(storage);
        carritoContador=cesta.length;
        countCesta.textContent=carritoContador
        return true;
    }catch(e){
        localStorage.removeItem("carrito");
        cesta=[];
        carritoContador = 0;
        return false;
    }
}

// Añade un producto a la cesta, la guarda en localStorage y avisa al usuario
function anyadirAlCesta(product) {
    carrito();
    cesta.push(product);
    localStorage.setItem("carrito", JSON.stringify(cesta));
    countCesta.textContent = cesta.length;
    alert(" se ha anadido"+product.nombre)
}
// Pinta una tarjeta (imagen, nombre, precio, descuento y botón) por cada producto recibido
function crearCards(productos) {
    section.innerHTML = "";   // vaciamos las tarjetas anteriores
    productos.forEach(product => {
        // Creamos los elementos HTML de la tarjeta
        const div = document.createElement("div");
        const img = document.createElement("img");
        const h3 = document.createElement("h3");
        const h2 = document.createElement("h2");
        const p = document.createElement("p");
        const button = document.createElement("button");
        button.textContent="Anadir a la cesta"

        // Al hacer clic en el botón se añade este producto a la cesta
        button.addEventListener("click",()=>{
            anyadirAlCesta(product);
        })

        // Rellenamos los elementos con los datos del producto
        img.src = product.imagen;
        h3.textContent = product.nombre;
        h2.textContent = product.precio;
        p.textContent = product.descuento;

        // Clases CSS para darles estilo
        div.className = "card";
        h2.className = "price";
        p.className = "discount";


        // Montamos la tarjeta y la añadimos a la página
        div.appendChild(img);
        div.appendChild(h3);
        div.appendChild(h2);
        div.appendChild(p);
        div.appendChild(button);


        section.appendChild(div);

    })
}


// Recibe el valor del filtro seleccionado y devuelve los productos que lo cumplen
function filtrar(filtro) {

    switch (filtro) {
        // Filtros por marca
        case "nvidia":
            filtrados = filtroMarca("nvidia");
            break;
        case "amd":
            filtrados = filtroMarca("amd");
            break;
        case "intel":
            filtrados = filtroMarca("intel");
            break;
        // Filtros por rango de precio
        case "menor":
            filtrados = filtroPrecio("menor");
            break;
        case "entre":
            filtrados = filtroPrecio("entre");
            break;
        case "mayor":
            filtrados = filtroPrecio("mayor");
            break;
        // Filtros por tipo (botones del menú superior)
        case "ordenadores":
            filtrados = filtroTipo("ordenador");
            break;
        case "componentes":
            filtrados = filtroTipo("componente");
            break;
        case "perifericos":
            filtrados = filtroTipo("preferico");
            break;
        // "Inicio" navega a la portada
        case "inicio":
            window.location.href = "index.html"
            break;

    }
    return filtrados;
}

// Devuelve solo los productos de la marca indicada
function filtroMarca(marca) {
    const productosFiltrados = productos.filter(p => p.marca === marca);
    return productosFiltrados;
}

// Devuelve solo los productos del tipo indicado (ordenador, componente, periférico)
function filtroTipo(tipo) {
    const productosFiltrados = productos.filter(p => p.tipo === tipo);
    return productosFiltrados;
}

// Devuelve los productos según el rango de precio: menor (<200), entre (200-500), mayor (>500)
function filtroPrecio(precio) {
    if (precio === "menor") {
        return productos.filter(p => {
            // Quitamos el símbolo del precio y lo convertimos a número
            const price = parseFloat((p.precio.replace("$", "")));
            if (price < 200) {
                return true;
            }
        })
    }
    else if (precio === "entre") {
        return productos.filter(p => {
            const price = parseFloat((p.precio.replace("$", "")));
            if (price >= 200 && +price <= 500) {
                return true;
            }
        })
    }
    else if (precio === "mayor") {
        return productos.filter(p => {
            const price = parseFloat((p.precio.replace("$", "")));
            if (price > 500) {
                return true;
            }
        })
    }
}


// Arrancamos la página
iniciar();


// Cuando el usuario marca un filtro del panel lateral, filtramos y volvemos a pintar las tarjetas
sidebarFiltro.addEventListener("change", (e) => {

    const inputSelected = e.target.closest("input");
    const filtro = inputSelected.value;

    filtrados = filtrar(filtro);
    crearCards(filtrados);

})

// Cuando el usuario pulsa un botón del menú de categorías, filtramos por esa categoría
btnHeader.addEventListener("click", (e) => {
    const btnSelected = e.target.closest("button");
    const filtro = btnSelected.dataset.go;
    filtrados = filtrar(filtro);
    crearCards(filtrados);

})

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

// Botón de la cesta: va a la página del carrito
btnCesta.addEventListener("click",()=>{window.location.href="carrito.html"})

// Botón "Mi cuenta": va a la página de cuenta
btnMiCuenta.addEventListener("click",()=>{
window.location.href="miCuenta.html";
})



