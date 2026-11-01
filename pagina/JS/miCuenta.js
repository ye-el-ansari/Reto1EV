const iniciarSesion=document.getElementById("iniciarSesion");
const registrarse = document.getElementById("registrarse");
const form=document.querySelector("form");
const usuario = document.querySelectorAll(".usuario");
const correo=document.querySelectorAll(".correo");
const contraseña=document.querySelectorAll(".contraseña");
const confirmarContraseña = document.querySelectorAll(".confirmarContraseña");
let usuarios=localStorage.getItem("usuarios")||[];
/*Este evento lo que hace es que cuando clicke en registrar muestre el input y label de contraseña y confirmar contraseña y oculte el label e input de usuario, el e.preventDefault() lo que hace es que no se reinicie la pagina web el formulario por defecto*/
registrarse.addEventListener("click", function(e) {
     usuario[1].value="";
        correo[1].value="";
    
    e.preventDefault();
    registrarse.style.boxShadow="0px 0px 10px 5px #ff5500";
    iniciarSesion.style.boxShadow="";
    contraseña.forEach((input) => {
        input.style.display = "block";
    });
        confirmarContraseña.forEach((input) => {
            input.style.display = "block";
        });
        
});
/*Este evento lo que hace es que cuando clicke en iniciar sesion oculte el input y label de contraseña y confirmar contraseña y muestre el label e input de usuario, el e.preventDefault() lo que hace es que no se reinicie la pagina web el formulario por defecto*/
iniciarSesion.addEventListener("click", function(e) {
   usuario[1].value="";
        correo[1].value="";
        contraseña[1].value="";
        confirmarContraseña[1].value="";
    e.preventDefault();
    iniciarSesion.style.boxShadow="0px 0px 10px 5px #ff5500";
    registrarse.style.boxShadow="";
        confirmarContraseña.forEach((input) => {
            input.style.display = "none";
        });
        usuario.forEach((input)=>{
            input.style.display="block";
        });
        contraseña.forEach((input) => {
            input.style.display = "none";
        });
        
});
/*Este evento lo que hace es que cuando clicke en el boton de entrar guarde los datos del usuario en el localStorage y si no hay ningun campo vacio envie el formulario, el e.preventDefault() lo que hace es que no se reinicie la pagina web el formulario por defectoy el e.target.submit() lo que hace es que se envie el formulario*/
form.addEventListener("submit",function(e) {
   e.preventDefault();
        if(usuario[1].value && correo[1].value && contraseña[1].value && confirmarContraseña[1].value){
           const datos={
            "usuario":usuario[1].value,
            "correo":correo[1].value,
            "contraseña":contraseña[1].value
            };
            localStorage.setItem("usuarios", JSON.stringify(datos));
              e.target.submit();
           
    }

});
    
