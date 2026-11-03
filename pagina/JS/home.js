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

        // D) Metemos la tarjeta con su botón ya listo dentro de tu página
        contenedor.appendChild(tarjetaDiv);
    });
}

// Encendemos la función al cargar la página
cargarProductos();
