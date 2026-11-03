let id=[];
let productos=[];
const section=document.querySelector("section");
let precioTotal=0;
const divCesta=document.getElementById("divCesta");
/*Hacemos la llamada al evento del documento de tipo DOMContentLoaded para que se ejecute el evento al cargar el HTML y el CSS con una funcion asincrona pora poder hacer uso del await al acceder al servidor json de ids y productos,despues se rellena los arrays con esos datos, uno para ids y otro para productos*/
document.addEventListener("DOMContentLoaded",async function() {
    try{
    await fetch("http://localhost:3000/ids")
    .then(async respuesta=>{
        if(!respuesta.ok){
            alert("No respondió el servidor");
            return;
        }
        const json=await respuesta.json(); 
        return json;
    })
    .then(id=>{
        this.id=id;
    });
    await fetch("http://localhost:3000/productos")
    .then(async respuesta=>{
        if(!respuesta.ok){
            alert("No respondió el servidor");
            return;
        }
        const json=await respuesta.json();
        return json;
    })
    .then(productos=>{
        this.productos=productos;
    });
}catch(error){
    console.log(error.message);
}
});
/*Si el array donde se guardan las ids de los productos no tiene datos aparece un mensaje de que no hay productos en la seccion si no se hace un bucle que recorra cada id y en cada id que recorra los productos si el id es el mismo que el id del producto muestra el nombre, la imagen, el precio, y el descuento del producto */
if(id.length===0){
            section.innerHTML="<p>No hay productos en el carrito</p>";
            
    }else{
for(let i=0;i<id.length;i++){
    section.innerHTML="";
    
    for(let j=0;j<productos.length;j++){
    if(id[i]===productos[j].id){
        section.innerHTML+=`<div><img src="${productos[j].imagen}"><h3>${productos[j].nombre}</h3><p>${productos[j].descuento}</p></div>`;
        precioTotal+=parseFloat(productos[j].precio.replace("€",""));
    }
}
}
}
divCesta.innerHTML=`<p>${id.length} productos | ${precioTotal}€</p>`;