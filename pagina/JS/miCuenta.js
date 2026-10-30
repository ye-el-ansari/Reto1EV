const registrarse = document.getElementById("registrarse");
const confirmarContraseña = document.querySelectorAll(".confirmarContraseña");
let conf=false;
registrarse.addEventListener("click", function(e) {
    e.preventDefault();
    if(!conf) {
        confirmarContraseña.forEach((input) => {
            input.style.display = "block";
        });
        conf=true;
    }else{
        confirmarContraseña.forEach((input) => {
            input.style.display = "none";
        });
        conf=false;
    }
});