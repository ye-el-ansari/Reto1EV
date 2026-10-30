const registrarse = document.getElementById("registrarse");
const cusuario = document.querySelectorAll(".usuario");
const confirmarContraseña = document.querySelectorAll(".confirmarContraseña");
const form=document.querySelector("form");
const correo=document.getElementById("correo");
/*Este evento lo que hace es que cuando clicke en registrar muestre o oculte el input y label del segundo confirmar contraseña, el e.preventDefault() lo que hace es que no se reinicie la pagina web el formulario por defecto*/
registrarse.addEventListener("click", function(e) {
    e.preventDefault();
        confirmarContraseña.forEach((input) => {
            input.style.display = "block";
        });
        usuario.forEach((input)=>{
            input.style.display="none";
        });
});

