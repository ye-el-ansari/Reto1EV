const section=document.querySelector("section");
let precioTotal=0;
const divCesta=document.getElementById("divCesta");
const carrito=localStorage.getItem("carrito")||[];
const carritoJson=JSON.parse(carrito);
carritoJson.forEach(carrito=>{
    section.innerHTML+=`<div id="divSection">
    <img src="${carrito.imagen}">
    <div id="divTexto">
    <h5>${carrito.nombre}</h5>
    <p>${carrito.precio}</p>
    </div>
    </div>
    `
    precioTotal+=parseFloat(carrito.precio.replace("€",""));
});
/*Si el array donde se guardan las ids de los productos no tiene datos aparece un mensaje de que no hay productos en la seccion si no se hace un bucle que recorra cada id y en cada id que recorra los productos si el id es el mismo que el id del producto muestra el nombre, la imagen, el precio, y el descuento del producto */
if(carrito.length===0){
            window.location="../HTML/index.html";
    }
    if(carritoJson.length===1){
divCesta.innerHTML+=`<div class="sep"> <p>${carritoJson.length} PRODUCTO </p> <div class="borde"> </div> <p> ${precioTotal}€</p> </div> <button id="btnCarrito" class="btnCarrito">¡Confirmar pedido!</button>`;
    }else{
        divCesta.innerHTML+=`<div class="sep"> <p>${carritoJson.length} PRODUCTOS </p> <div class="borde"> </div>  <p> ${precioTotal}€  </div> </p><button id="btnCarrito" class="btnCarrito">¡Confirmar pedido!</button><style>`;
    }