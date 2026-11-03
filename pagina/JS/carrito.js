const section=document.querySelector("section");
let precioTotal=0;
const divCesta=document.getElementById("divCesta");
const carrito=localStorage.getItem("carrito")||[];
carrito.forEach((carrito)=>{
    section.innerHTML+=`<div><img src="${carrito.imagen}"><h3>${carrito.nombre}</h3><p>${carrito.precio}</p></div>`;
    precioTotal+=parseFloat(productos[j].precio.replace("€",""));
});
/*Si el array donde se guardan las ids de los productos no tiene datos aparece un mensaje de que no hay productos en la seccion si no se hace un bucle que recorra cada id y en cada id que recorra los productos si el id es el mismo que el id del producto muestra el nombre, la imagen, el precio, y el descuento del producto */
if(carrito.length===0){
            /*window.location="../HTML/index.html";*/
            
            
    }
divCesta.innerHTML=`<p>${id.length} productos | ${precioTotal}€</p>`;