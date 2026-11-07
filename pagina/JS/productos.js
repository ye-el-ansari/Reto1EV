const btnLogin = document.getElementById("btnLogin");
const btnCesta = document.getElementById("cartBtn");
const countCesta = document.getElementById("cartCount");
const btnHeader = document.getElementById("header-button");
const sidebarFiltro = document.querySelector(".sidebar");
const section = document.querySelector(".cards");
const btnMiCuenta=document.getElementById("btnMiCuenta");

const url = "http://localhost:3000";
let productos = [];
let filtrados = [];
let cesta = [];
let usuario=null;
let logeado=false;
let carritoContador=0;



async function cargarProductos() {
    const res = await fetch(`${url}/productos`);
    if (!res.ok) {
        throw new Error("hubo un error al cargar los productos");
    }
    productos = await res.json();
}
async function iniciar() {
    await cargarProductos();
    crearCards(productos);
    carrito();

    esLogeado() ? (btnLogin.textContent="🔓 Logout",btnMiCuenta.style.display="block"):"";

}

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
        logueado=false;
        return false;
    }
}

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

function anyadirAlCesta(product) {
    carrito();
    cesta.push(product);
    localStorage.setItem("carrito", JSON.stringify(cesta));
    countCesta.textContent = cesta.length;
}
function crearCards(productos) {
    section.innerHTML = "";
    productos.forEach(product => {
        const div = document.createElement("div");
        const img = document.createElement("img");
        const h3 = document.createElement("h3");
        const h2 = document.createElement("h2");
        const p = document.createElement("p");
        const button = document.createElement("button");
        button.textContent="Anadir a la cesta"

        button.addEventListener("click",()=>{
            anyadirAlCesta(product);
        })

        button.addEventListener("click",()=>{

        })

        img.src = product.imagen;
        h3.textContent = product.nombre;
        h2.textContent = product.precio;
        p.textContent = product.descuento;

        div.className = "card";
        h2.className = "price";
        p.className = "discount";


        div.appendChild(img);
        div.appendChild(h3);
        div.appendChild(h2);
        div.appendChild(p);
        div.appendChild(button);


        section.appendChild(div);

    })
}


function filtrar(filtro) {

    switch (filtro) {
        case "nvidia":
            filtrados = filtroMarca("nvidia");
            break;
        case "amd":
            filtrados = filtroMarca("amd");
            break;
        case "intel":
            filtrados = filtroMarca("intel");
            break;
        case "menor":
            filtrados = filtroPrecio("menor");
            break;
        case "entre":
            filtrados = filtroPrecio("entre");
            break;
        case "mayor":
            filtrados = filtroPrecio("mayor");
            break;
        case "ordenadores":
            filtrados = filtroTipo("ordenador");
            break;
        case "componentes":
            filtrados = filtroTipo("componente");
            break;
        case "perifericos":
            filtrados = filtroTipo("preferico");
            break;
        case "inicio":
            window.location.href = "index.html"
            break;

    }
    return filtrados;
}

function filtroMarca(marca) {
    const productosFiltrados = productos.filter(p => p.marca === marca);
    return productosFiltrados;
}

function filtroTipo(tipo) {
    const productosFiltrados = productos.filter(p => p.tipo === tipo);
    return productosFiltrados;
}

function filtroPrecio(precio) {
    if (precio === "menor") {
        return productos.filter(p => {
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


iniciar();


sidebarFiltro.addEventListener("change", (e) => {

    const inputSelected = e.target.closest("input");
    const filtro = inputSelected.value;

    filtrados = filtrar(filtro);
    crearCards(filtrados);

})

btnHeader.addEventListener("click", (e) => {
    const btnSelected = e.target.closest("button");
    const filtro = btnSelected.dataset.go;
    filtrados = filtrar(filtro);
    crearCards(filtrados);

})

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

btnCesta.addEventListener("click",()=>{window.location.href="carrito.html"})

btnMiCuenta.addEventListener("click",()=>{
window.location.href="miCuenta.html";
})



