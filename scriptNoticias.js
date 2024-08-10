document.addEventListener('DOMContentLoaded', function() {
    // Obtener el modal
    var modal = document.getElementById("modal");

    // Obtener la imagen y el elemento de inserción de la imagen dentro del modal
    var modalImg = document.getElementById("modal-img");
    var img = document.getElementById("imagen-noticia");

    // Obtener el botón de cerrar
    var span = document.getElementById("close");

    // Función para abrir el modal al hacer clic en la imagen
    img.onclick = function() {
        modal.style.display = "block";
        modalImg.src = this.src;
    }

    // Función para cerrar el modal
    span.onclick = function() { 
        modal.style.display = "none";
    }

    // Cerrar el modal al hacer clic fuera de la imagen
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});
