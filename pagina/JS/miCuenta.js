if(localStorage.getItem("usuario")){
    window.location="../HTML/carrito.html";
}else{
const iniciarSesion=document.getElementById("iniciarSesion");
const registrarse = document.getElementById("registrarse");
const form=document.querySelector("form");
const usuario = document.querySelectorAll(".usuario");
const correo=document.querySelectorAll(".correo");
const contraseña=document.querySelectorAll(".contraseña");
const confirmarContraseña = document.querySelectorAll(".confirmarContraseña");
const error=document.getElementById("error");
let conf=false;
let usuarios=[];
fetch("http://localhost:3000/usuarios")
            .then(response=>{
                if(!response.ok){
                     alert("No respondió el servidor");
                }
                return response.json();})
            .then(datos=>{
                    for(let i=0;i<datos.length;i++){
                    console.log(datos[i].usuario);
                    if(datos[i].usuario===usuario[1].value&&datos[i].correo===correo[1].value){
                        conf=true; 
                    }
                }
                usuarios=datos;
                
            });
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
        error.style.display="none";
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
form.addEventListener("submit",async function(e) {
        if(usuario[1].value && correo[1].value && contraseña[1].value && confirmarContraseña[1].value){
            e.preventDefault();
            const datos={
            "usuario":usuario[1].value,
            "correo":correo[1].value,
            "contraseña":contraseña[1].value
            };
                    for(let i=0;i<usuarios.length;i++){
                    if(usuarios[i].usuario===usuario[1].value&&usuarios[i].correo===correo[1].value){
                        conf=true; 
                    }
                }
                
            if(conf){
                    error.style.display="block";
                    return;
            }
                e.target.submit();
            await fetch("http://localhost:3000/usuarios",{
                    method:"POST",
                    headers:{
                        "content-type":"application/json"
                    },
                    body:JSON.stringify(datos)
                    
            });
              
           
    }else if(usuario[1].value && correo[1].value){
        for(let i=0;i<usuarios.length;i++){
            if(usuario[1].value===usuarios[i].usuario&&correo[1].value===usuarios[i].correo){
                localStorage.setItem("usuario",JSON.stringify(usuarios[i]));
                e.target.submit();
            }
        }
        
    }

});
}