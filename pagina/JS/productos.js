const btnLogin = document.getElementById("btnLogin");
const btnCesta = document.getElementById("cartBtn");
const countCesta = document.getElementById("cartCount");
const btnHeader = document.getElementById("header-button");
const sidebarFiltro = document.querySelector(".sidebar");
const section = document.querySelector(".cards");

const urlProduct = "http://localhost:3000/productos";
let productos = [];



async function cargarProductos() {
    const res = await fetch(urlProduct);
    if (!res.ok) {
        throw new Error("hubo un error al cargar los productos");
    }
    productos = await res.json();
}

function crearCards(productos) {
    productos.forEach(product => {
        const div = document.createElement("div");
        const img = document.createElement("img");
        const h3 = document.createElement("h3");
        const h2 = document.createElement("h2");
        const p = document.createElement("p");
        const button = document.createElement("button");

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
        case "nividia":
            filtroMarca("nvidia");
            break;
        case "amd":
            filtroMarca("amd");
            break;
        case "intel":
            filtroMarca("intel");
            break;
        case "menor":

            break;
        case "entre":

            break;
        case "mayor":
            break;

    }
}

function filtroMarca(marca){
    const productosFiltrados=productos.filter(p=>p.marca===marca);
    return productosFiltrados;
}
function filtroPrecio(precio){
    if(precio==="menor"){
        const productosFiltrados=productos.filter(p=>{
            p.precio.length=p.precio.length-1;
            +p.precio<200
        })
    }
}

async function iniciar() {
    await cargarProductos();
    crearCards(productos);

    console.log(productos);

}

iniciar();


sidebarFiltro.addEventListener("change", (e) => {
    const inputSelected = e.target.closest("input");
    const filtro = inputSelected.value;


})

